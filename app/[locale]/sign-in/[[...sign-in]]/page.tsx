import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"
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
    <section className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="space-y-5 text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Free workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your public tools remain free and do not require an account.
          </p>
        </div>
        <SignIn
          forceRedirectUrl={redirectUrl}
          fallbackRedirectUrl={redirectUrl}
          signUpUrl={authUrlWithRedirect("/sign-up/", redirectUrl)}
        />
      </div>
    </section>
  )
}
