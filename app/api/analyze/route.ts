import { type NextRequest, NextResponse } from "next/server"
import type { ThreatCategory } from "@/lib/types"

// Simple ML-like classification based on keywords
function classifyThreat(description: string): {
  predicted_category: ThreatCategory
  confidence: number
  risk_level: "Low" | "Medium" | "High"
} {
  const text = description.toLowerCase()

  // Keyword patterns for different threat categories
  const patterns = {
    Phishing: [
      "phishing",
      "email",
      "suspicious email",
      "bank",
      "verification",
      "click here",
      "urgent",
      "account",
      "login",
    ],
    Malware: ["malware", "virus", "trojan", "infected", "malicious file", "executable", "download"],
    Ransomware: [
      "ransomware",
      "encrypted",
      "ransom",
      "payment",
      "cryptocurrency",
      "bitcoin",
      "decrypt",
      "files locked",
    ],
    DDoS: ["ddos", "denial of service", "traffic", "overwhelmed", "server down", "flooding"],
    "Data Breach": ["data breach", "leaked", "unauthorized access", "stolen data", "confidential", "exposed"],
    "Social Engineering": ["social engineering", "manipulation", "pretending", "impersonation", "trust"],
    "Insider Threat": ["insider", "employee", "internal", "privileged access", "unauthorized"],
    "Advanced Persistent Threat": ["apt", "persistent", "advanced", "targeted", "sophisticated"],
  }

  let bestMatch: ThreatCategory = "Phishing"
  let maxScore = 0

  for (const [category, keywords] of Object.entries(patterns)) {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (text.includes(keyword) ? 1 : 0)
    }, 0)

    if (score > maxScore) {
      maxScore = score
      bestMatch = category as ThreatCategory
    }
  }

  // Calculate confidence based on keyword matches
  const confidence = Math.min(0.95, Math.max(0.3, maxScore / 5))

  // Determine risk level based on category and confidence
  let risk_level: "Low" | "Medium" | "High" = "Medium"

  if (["Ransomware", "Data Breach", "Advanced Persistent Threat"].includes(bestMatch)) {
    risk_level = "High"
  } else if (["Phishing", "Malware"].includes(bestMatch)) {
    risk_level = confidence > 0.7 ? "High" : "Medium"
  } else {
    risk_level = confidence > 0.8 ? "Medium" : "Low"
  }

  return {
    predicted_category: bestMatch,
    confidence,
    risk_level,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json()

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    const result = classifyThreat(description)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze threat" }, { status: 500 })
  }
}
