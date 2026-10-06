import { NextRequest } from "next/server"
import { z } from "zod"
import { trackSchema } from "@/lib/soundcloud/contracts"
import { serviceRequest, serviceJson, serviceErrorResponse } from "@/lib/soundcloud/service"
export const runtime = "nodejs"
export async function POST(request: NextRequest) {
  try {
    const input = z.object({ url: z.string().min(1) }).parse(await request.json())
    const info = await serviceRequest({
      path: "/v1/soundcloud/info",
      schema: trackSchema,
      body: input,
    })
    return serviceJson({ success: true, info })
  } catch (error: unknown) {
    return serviceErrorResponse(error)
  }
}
