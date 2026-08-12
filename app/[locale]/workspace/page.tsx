import { permanentRedirect } from "next/navigation"

export default async function LegacyWorkspacePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  permanentRedirect(`${locale === "en" ? "" : `/${locale}`}/audio-toolkit/`)
}
