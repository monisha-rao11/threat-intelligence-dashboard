import { NextResponse } from "next/server"
import { getThreatData } from "@/lib/threat-data"

export async function GET() {
  try {
    const threats = getThreatData()

    const categoryStats = threats.reduce(
      (acc, threat) => {
        acc[threat.threatCategory] = (acc[threat.threatCategory] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const severityStats = threats.reduce(
      (acc, threat) => {
        acc[threat.severityScore] = (acc[threat.severityScore] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      totalThreats: threats.length,
      categoryStats,
      severityStats,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
