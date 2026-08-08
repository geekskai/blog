import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getCreemClient } from "@/lib/billing/creem"
import { getCreemCustomerId } from "@/lib/billing/repository"

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  const customerId = await getCreemCustomerId(userId)
  if (!customerId) return NextResponse.json({ error: "No billing account was found." }, { status: 404 })

  try {
    const links = await getCreemClient().customers.generateBillingLinks({ customerId })
    return NextResponse.json({ url: links.customerPortalLink })
  } catch (error) {
    console.error("Creem portal creation failed", error)
    return NextResponse.json({ error: "Billing management is temporarily unavailable." }, { status: 502 })
  }
}
