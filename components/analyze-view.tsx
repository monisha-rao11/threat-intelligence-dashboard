"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Zap, AlertTriangle, CheckCircle } from "lucide-react"
import type { ThreatCategory } from "@/lib/types"

interface AnalysisResult {
  predicted_category: ThreatCategory
  confidence: number
  risk_level: "Low" | "Medium" | "High"
}

export function AnalyzeView() {
  const [description, setDescription] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError("Please enter a threat description to analyze")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: description.trim() }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Failed to analyze threat. Please try again.")
    } finally {
      setLoading(false)
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "High":
        return AlertTriangle
      case "Medium":
        return Zap
      case "Low":
        return CheckCircle
      default:
        return CheckCircle
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI-Powered Threat Classification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="description" className="text-sm font-medium mb-2 block">
              Threat Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter a suspicious activity description, email content, or security incident details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <Button onClick={handleAnalyze} disabled={loading || !description.trim()} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Analyze Threat
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Predicted Category</h3>
                <Badge variant={getCategoryColor(result.predicted_category)} className="text-sm px-3 py-1">
                  {result.predicted_category}
                </Badge>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Confidence Score</h3>
                <div className="text-2xl font-bold">{(result.confidence * 100).toFixed(1)}%</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Risk Level</h3>
                <div className="flex items-center justify-center gap-2">
                  {(() => {
                    const Icon = getRiskIcon(result.risk_level)
                    return <Icon className="h-4 w-4" />
                  })()}
                  <Badge variant={getRiskColor(result.risk_level)}>{result.risk_level}</Badge>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Recommendation</h4>
              <p className="text-sm text-muted-foreground">
                {result.risk_level === "High" &&
                  "Immediate action required. This threat poses a significant risk and should be escalated to the security team immediately."}
                {result.risk_level === "Medium" &&
                  "Monitor closely. This threat requires attention and should be investigated further by security personnel."}
                {result.risk_level === "Low" &&
                  "Low priority. This appears to be a minor threat that can be handled through standard security procedures."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sample Threat Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">Try these sample descriptions to test the analysis:</p>
            <div className="grid gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setDescription(
                    "Suspicious email received with attachment claiming to be from bank asking for account verification",
                  )
                }
                className="justify-start text-left h-auto p-3"
              >
                <span className="text-xs">
                  "Suspicious email received with attachment claiming to be from bank asking for account verification"
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setDescription(
                    "Multiple failed login attempts detected from unusual IP addresses in different countries",
                  )
                }
                className="justify-start text-left h-auto p-3"
              >
                <span className="text-xs">
                  "Multiple failed login attempts detected from unusual IP addresses in different countries"
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDescription("Files encrypted with ransom note demanding payment in cryptocurrency")}
                className="justify-start text-left h-auto p-3"
              >
                <span className="text-xs">"Files encrypted with ransom note demanding payment in cryptocurrency"</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
