import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FoundationClient } from "./foundation-client"

export default async function FoundationPage() {
  // Get the current session
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/")
  }

  // Check if user has a profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  // Redirect to questionnaire if user doesn't have a profile
  if (!profile?.name) {
    redirect("/questionnaire")
  }

  // Redirect to dashboard if user is not a 12th pass student
  if (profile.education_status !== "12th pass") {
    redirect("/dashboard")
  }

  // User is authenticated and is a 12th pass student, render the client component
  return <FoundationClient userName={profile.name} stream={profile.stream} />
}
