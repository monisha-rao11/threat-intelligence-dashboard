import type { Threat, ThreatCategory } from "./types"

interface CSVRow {
  "Original Threat Description": string
  "Cleaned Threat Description": string
  "Threat Category": string
  "Severity Score": string
}

export function parseCSV(csvContent: string): Threat[] {
  const lines = csvContent.split("\n")
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

  const threats: Threat[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Simple CSV parsing (you might want to use a proper CSV library for production)
    const values = parseCSVLine(line)
    if (values.length < 4) continue

    const row: CSVRow = {
      "Original Threat Description": values[0] || "",
      "Cleaned Threat Description": values[1] || "",
      "Threat Category": values[2] || "",
      "Severity Score": values[3] || "",
    }

    // Clean and normalize the data
    const threatCategory = normalizeThreatCategory(row["Threat Category"])
    const severityScore = normalizeSeverityScore(row["Severity Score"])

    if (threatCategory && severityScore && row["Cleaned Threat Description"]) {
      threats.push({
        id: i.toString(),
        originalThreatDescription: row["Original Threat Description"],
        cleanedThreatDescription: row["Cleaned Threat Description"],
        threatCategory,
        severityScore,
      })
    }
  }

  return threats
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

function normalizeThreatCategory(category: string): ThreatCategory | null {
  const normalized = category.toLowerCase().trim()

  const categoryMap: Record<string, ThreatCategory> = {
    phishing: "Phishing",
    malware: "Malware",
    ransomware: "Ransomware",
    ddos: "DDoS",
    "data breach": "Data Breach",
    "social engineering": "Social Engineering",
    "insider threat": "Insider Threat",
    "advanced persistent threat": "Advanced Persistent Threat",
    apt: "Advanced Persistent Threat",
  }

  return categoryMap[normalized] || null
}

function normalizeSeverityScore(severity: string): "Low" | "Medium" | "High" | null {
  const normalized = severity.toLowerCase().trim()

  const severityMap: Record<string, "Low" | "Medium" | "High"> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    "1": "Low",
    "2": "Medium",
    "3": "High",
  }

  return severityMap[normalized] || null
}
