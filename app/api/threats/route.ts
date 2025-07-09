import { type NextRequest, NextResponse } from "next/server"
import { getThreatData } from "@/lib/threat-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""

  try {
    const threats = getThreatData()

    // Filter threats based on search and category
    let filteredThreats = threats

    if (search) {
      filteredThreats = filteredThreats.filter(
        (threat) =>
          threat.cleanedThreatDescription.toLowerCase().includes(search.toLowerCase()) ||
          threat.originalThreatDescription.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (category) {
      filteredThreats = filteredThreats.filter((threat) => threat.threatCategory === category)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedThreats = filteredThreats.slice(startIndex, endIndex)

    return NextResponse.json({
      threats: paginatedThreats,
      total: filteredThreats.length,
      page,
      limit,
      totalPages: Math.ceil(filteredThreats.length / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch threats" }, { status: 500 })
  }
}
