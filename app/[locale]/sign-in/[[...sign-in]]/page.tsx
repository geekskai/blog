import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in | GeeksKai",
  robots: { index: false, follow: false },
}

export default function SignInPage() {
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
        <SignIn fallbackRedirectUrl="/workspace/" />
      </div>
    </section>
  )
}
