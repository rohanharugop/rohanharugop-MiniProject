import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("Error exchanging code for session:", error.message)
        // Redirect to home page with error if authentication fails
        return NextResponse.redirect(
          new URL(`/?error=${encodeURIComponent("Authentication failed")}`, request.url)
        )
      }
      
      // If session was successfully created, redirect to questionnaire
      if (data.session) {
        // URL to redirect to after sign in process completes
        return NextResponse.redirect(new URL("/questionnaire", request.url))
      }
    } catch (err) {
      console.error("Unexpected error during authentication:", err)
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("Authentication failed")}`, request.url)
      )
    }
  }

  // If no code was provided, redirect back to home
  return NextResponse.redirect(new URL("/", request.url))
}
