"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react"
import type { Threat, ThreatCategory } from "@/lib/types"
import { ThreatDetailDialog } from "@/components/threat-detail-dialog"

export function ThreatsView() {
  const [threats, setThreats] = useState<Threat[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null)

  const limit = 10

  useEffect(() => {
    fetchThreats()
  }, [currentPage, searchTerm, selectedCategory])

  async function fetchThreats() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      })

      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory) params.append("category", selectedCategory)

      const response = await fetch(`/api/threats?${params}`)
      const data = await response.json()

      setThreats(data.threats)
      setTotalPages(Math.ceil(data.total / limit))
    } catch (error) {
      console.error("Failed to fetch threats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleCategoryFilter = (value: string) => {
    setSelectedCategory(value === "all" ? "" : value)
    setCurrentPage(1)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getCategoryColor = (category: ThreatCategory) => {
    const colors = {
      Phishing: "destructive",
      Malware: "destructive",
      Ransomware: "destructive",
      DDoS: "secondary",
      "Data Breach": "destructive",
      "Social Engineering": "secondary",
      "Insider Threat": "outline",
      "Advanced Persistent Threat": "destructive",
    }
    return colors[category] || "outline"
  }

  if (loading) {
    return <div>Loading threats...</div>
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search threat descriptions..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory || "all"} onValueChange={handleCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Phishing">Phishing</SelectItem>
              <SelectItem value="Malware">Malware</SelectItem>
              <SelectItem value="Ransomware">Ransomware</SelectItem>
              <SelectItem value="DDoS">DDoS</SelectItem>
              <SelectItem value="Data Breach">Data Breach</SelectItem>
              <SelectItem value="Social Engineering">Social Engineering</SelectItem>
              <SelectItem value="Insider Threat">Insider Threat</SelectItem>
              <SelectItem value="Advanced Persistent Threat">Advanced Persistent Threat</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Threats List */}
      <div className="space-y-4">
        {threats.map((threat) => (
          <Card
            key={threat.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedThreat(threat)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{threat.threatCategory}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={getCategoryColor(threat.threatCategory)}>{threat.threatCategory}</Badge>
                  <Badge variant={getSeverityColor(threat.severityScore)}>{threat.severityScore}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{threat.cleanedThreatDescription}</p>
              <div className="mt-2 text-xs text-muted-foreground">ID: {threat.id}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Threat Detail Dialog */}
      {selectedThreat && (
        <ThreatDetailDialog
          threat={selectedThreat}
          open={!!selectedThreat}
          onOpenChange={(open) => !open && setSelectedThreat(null)}
        />
      )}
    </div>
  )
}
