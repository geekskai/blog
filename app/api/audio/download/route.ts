import { getAudioDownloadLink } from "@/app/lib/youtube/api"
import { handleDownloadRoute } from "@/app/api/_shared/youtube"
import { withDownloadReservation } from "@/lib/download-quota/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  return withDownloadReservation(request, ["youtube-audio"], () =>
    handleDownloadRoute(request, "api/audio/download", getAudioDownloadLink)
  )
}
