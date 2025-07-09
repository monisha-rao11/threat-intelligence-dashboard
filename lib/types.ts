export type ThreatCategory =
  | "Phishing"
  | "Malware"
  | "Ransomware"
  | "DDoS"
  | "Data Breach"
  | "Social Engineering"
  | "Insider Threat"
  | "Advanced Persistent Threat"

export interface Threat {
  id: string
  originalThreatDescription: string
  cleanedThreatDescription: string
  threatCategory: ThreatCategory
  severityScore: "Low" | "Medium" | "High"
}

export interface ThreatStats {
  totalThreats: number
  categoryStats: Record<string, number>
  severityStats: Record<string, number>
}
