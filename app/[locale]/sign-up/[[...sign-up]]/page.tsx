import { SignUp } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create a free account | GeeksKai",
  robots: { index: false, follow: false },
}

export default function SignUpPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="space-y-5 text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Optional account
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Create your free workspace</h1>
          <p className="mt-2 text-sm text-slate-400">
            Save project metadata and presets. Audio files are never uploaded.
          </p>
        </div>
        <SignUp fallbackRedirectUrl="/workspace/" />
      </div>
    </section>
  )
}
