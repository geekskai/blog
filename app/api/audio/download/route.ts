import { getAudioDownloadLink } from "@/app/lib/youtube/api"
import { handleDownloadRoute } from "@/app/api/_shared/youtube"
import { withRegisteredDownloadReservation } from "@/lib/download-quota/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  return withRegisteredDownloadReservation(request, ["youtube-audio"], () =>
    handleDownloadRoute(request, "api/audio/download", getAudioDownloadLink)
  )
}
