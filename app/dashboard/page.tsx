import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signOut } from "@/lib/actions"

export default async function Dashboard() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // If no profile, redirect to questionnaire
  if (!profile) {
    redirect("/questionnaire")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <div className="flex w-full justify-between">
          <a className="flex items-center justify-center" href="#">
            <span className="font-bold text-xl">Student Portal</span>
          </a>
          <form
            action={async () => {
              "use server"
              const result = await signOut()
              if (result.success) {
                redirect(result.redirectUrl)
              }
            }}
          >
            <Button variant="ghost">Sign Out</Button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome, {profile.name}!</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium">Name:</dt>
                    <dd>{profile.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Age:</dt>
                    <dd>{profile.age}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Gender:</dt>
                    <dd>{profile.gender}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Educational Background</CardTitle>
                <CardDescription>Your academic details</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium">Status:</dt>
                    <dd>{profile.education_status}</dd>
                  </div>
                  {profile.stream && (
                    <div className="flex justify-between">
                      <dt className="font-medium">Stream:</dt>
                      <dd>{profile.stream}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
