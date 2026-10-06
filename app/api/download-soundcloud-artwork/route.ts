import { NextRequest } from "next/server"
import { withDownloadReservation } from "@/lib/download-quota/server"
import { createDownloadJob } from "@/lib/soundcloud/jobs"
export const runtime = "nodejs"
export async function POST(request: NextRequest) {
  return withDownloadReservation(request, ["soundcloud-artwork"], () =>
    createDownloadJob({ request, isArtwork: true })
  )
}
