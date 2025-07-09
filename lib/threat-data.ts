import type { Threat } from "./types"
import { parseCSV } from "./csv-parser"
import fs from "fs"
import path from "path"

let cachedThreats: Threat[] | null = null

export function getThreatData(): Threat[] {
  // Return cached data if available
  if (cachedThreats) {
    return cachedThreats
  }

  try {
    // Try to read the Kaggle CSV file
    const csvPath = path.join(process.cwd(), "data", "Cybersecurity_Dataset.csv")

    if (fs.existsSync(csvPath)) {
      console.log("Loading data from Kaggle CSV file...")
      const csvContent = fs.readFileSync(csvPath, "utf-8")
      cachedThreats = parseCSV(csvContent)
      console.log(`Loaded ${cachedThreats.length} threats from CSV`)
      return cachedThreats
    } else {
      console.warn("Kaggle CSV file not found at:", csvPath)
      console.warn(
        "Please download the dataset from: https://www.kaggle.com/datasets/hussainsheikh03/nlp-based-cyber-security-dataset",
      )
      console.warn("And place it in the data/ directory")
    }
  } catch (error) {
    console.error("Error reading CSV file:", error)
  }

  // Fallback to mock data if CSV is not available
  console.log("Using fallback mock data...")
  cachedThreats = getFallbackMockData()
  return cachedThreats
}

// Fallback mock data (reduced set for demonstration)
function getFallbackMockData(): Threat[] {
  return [
    {
      id: "1",
      originalThreatDescription:
        "Suspicious email received with attachment claiming to be from bank asking for account verification and immediate action required",
      cleanedThreatDescription:
        "Suspicious email with attachment claiming bank verification requiring immediate action",
      threatCategory: "Phishing",
      severityScore: "High",
    },
    {
      id: "2",
      originalThreatDescription:
        "Multiple failed login attempts detected from unusual IP addresses in different geographical locations within short time frame",
      cleanedThreatDescription: "Multiple failed login attempts from unusual IP addresses different locations",
      threatCategory: "Social Engineering",
      severityScore: "Medium",
    },
    {
      id: "3",
      originalThreatDescription:
        "Files on network drive have been encrypted with ransom note demanding payment in cryptocurrency for decryption key",
      cleanedThreatDescription: "Files encrypted with ransom note demanding cryptocurrency payment for decryption",
      threatCategory: "Ransomware",
      severityScore: "High",
    },
    {
      id: "4",
      originalThreatDescription:
        "Malicious executable file detected in email attachment attempting to establish backdoor connection to external server",
      cleanedThreatDescription:
        "Malicious executable in email attachment establishing backdoor connection external server",
      threatCategory: "Malware",
      severityScore: "High",
    },
    {
      id: "5",
      originalThreatDescription:
        "Unusual network traffic patterns indicating potential distributed denial of service attack targeting web servers",
      cleanedThreatDescription:
        "Unusual network traffic patterns indicating potential DDoS attack targeting web servers",
      threatCategory: "DDoS",
      severityScore: "Medium",
    },
  ]
}

// Clear cache function (useful for development)
export function clearThreatDataCache() {
  cachedThreats = null
}
