import { SignUp } from "@clerk/nextjs"
import type { Metadata } from "next"
import { safeLocalRedirectUrl } from "@/lib/auth/redirect"

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
    <section className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="space-y-5 text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            {isQuotaReturn ? "Free download allowance" : "Optional account"}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            {isQuotaReturn ? "Create a free account" : "Create your free workspace"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isQuotaReturn
              ? "Increase today's allowance from 3 to 10 downloads, then return to your tool."
              : "Save project metadata and presets. Audio files are never uploaded."}
          </p>
        </div>
        <SignUp forceRedirectUrl={redirectUrl} fallbackRedirectUrl={redirectUrl} />
      </div>
    </section>
  )
}
