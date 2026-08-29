import type { Metadata } from "next"
import AuthClerkPanel from "@/components/auth/AuthClerkPanel"
import AuthPageShell from "@/components/auth/AuthPageShell"
import { authUrlWithRedirect, safeLocalRedirectUrl } from "@/lib/auth/redirect"

export const metadata: Metadata = {
  title: "Create a free account | GeeksKai",
  robots: { index: false, follow: false },
}

type SignUpPageProps = {
  searchParams: Promise<{ redirect_url?: string | string[] }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const redirectUrl = safeLocalRedirectUrl((await searchParams).redirect_url)
  const isQuotaReturn = redirectUrl.includes("quota_return=1")

  return (
    <AuthPageShell
      eyebrow={isQuotaReturn ? "Free download allowance" : "Geekskai account"}
      title={isQuotaReturn ? "Create a free" : "Create your free"}
      titleAccent="account"
      description={
        isQuotaReturn
          ? "Increase today's allowance from 3 to 10 downloads, then return to your tool."
          : "Get 30 daily Audio Credits, billing access, and saved workspace settings."
      }
    >
      <AuthClerkPanel
        mode="sign-up"
        redirectUrl={redirectUrl}
        alternateAuthUrl={authUrlWithRedirect("/sign-in/", redirectUrl)}
        alternateLabel="Already have an account? Sign in"
      />
    </AuthPageShell>
  )
}
