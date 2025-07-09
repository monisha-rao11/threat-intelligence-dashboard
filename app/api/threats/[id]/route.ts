import { type NextRequest, NextResponse } from "next/server"
import { getThreatData } from "@/lib/threat-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const threats = getThreatData()
    const threat = threats.find((t) => t.id === params.id)

    if (!threat) {
      return NextResponse.json({ error: "Threat not found" }, { status: 404 })
    }

    return NextResponse.json(threat)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch threat" }, { status: 500 })
  }
}
