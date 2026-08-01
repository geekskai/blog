import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import DjWorkspace from "./DjWorkspace"

export const metadata: Metadata = {
  title: "DJ Workspace | GeeksKai",
  description: "Save SoundCloud preparation projects and reusable format presets.",
  robots: { index: false, follow: false },
}

export default async function WorkspacePage({ params }: { params: Promise<{ locale: string }> }) {
  const [{ userId }, { locale }] = await Promise.all([auth(), params])

  if (!userId) {
    const localePrefix = locale === "en" ? "" : `/${locale}`
    redirect(`${localePrefix}/sign-in/?redirect_url=${localePrefix}/workspace/`)
  }

  return <DjWorkspace userId={userId} />
}
