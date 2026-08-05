import { getVideoDownloadLink } from "@/app/lib/youtube/api"
import { handleDownloadRoute } from "@/app/api/_shared/youtube"
import { withRegisteredDownloadReservation } from "@/lib/download-quota/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  return withRegisteredDownloadReservation(request, ["youtube-video"], () =>
    handleDownloadRoute(request, "api/video/download", getVideoDownloadLink)
  )
}
