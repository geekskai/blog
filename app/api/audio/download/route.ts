import { getAudioDownloadLink } from "@/app/lib/youtube/api"
import { handleDownloadRoute } from "@/app/api/_shared/youtube"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  return handleDownloadRoute(request, "api/audio/download", getAudioDownloadLink)
}
