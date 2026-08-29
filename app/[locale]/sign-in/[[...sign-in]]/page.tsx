import type { Metadata } from "next"
import AuthClerkPanel from "@/components/auth/AuthClerkPanel"
import AuthPageShell from "@/components/auth/AuthPageShell"
import { authUrlWithRedirect, safeLocalRedirectUrl } from "@/lib/auth/redirect"

export const metadata: Metadata = {
  title: "Sign in | GeeksKai",
  robots: { index: false, follow: false },
}

type SignInPageProps = {
  searchParams: Promise<{ redirect_url?: string | string[] }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const redirectUrl = safeLocalRedirectUrl((await searchParams).redirect_url)

  return (
    <AuthPageShell
      eyebrow="Geekskai account"
      title="Welcome"
      titleAccent="back"
      description="Sign in for daily Audio Credits, billing, and saved workspace settings."
    >
      <AuthClerkPanel
        mode="sign-in"
        redirectUrl={redirectUrl}
        alternateAuthUrl={authUrlWithRedirect("/sign-up/", redirectUrl)}
        alternateLabel="Create a free account"
      />
    </AuthPageShell>
  )
}
