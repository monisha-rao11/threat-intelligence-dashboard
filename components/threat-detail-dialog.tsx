import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Threat, ThreatCategory } from "@/lib/types"

interface ThreatDetailDialogProps {
  threat: Threat
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThreatDetailDialog({ threat, open, onOpenChange }: ThreatDetailDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Threat Details
            <Badge variant={getCategoryColor(threat.threatCategory)}>{threat.threatCategory}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Threat ID</h4>
              <p className="text-sm">{threat.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Severity Score</h4>
              <Badge variant={getSeverityColor(threat.severityScore)}>{threat.severityScore}</Badge>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Original Description</h4>
            <p className="text-sm bg-muted p-3 rounded-md">{threat.originalThreatDescription}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Cleaned Description</h4>
            <p className="text-sm">{threat.cleanedThreatDescription}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Category:</span> {threat.threatCategory}
            </div>
            <div>
              <span className="font-medium">Severity:</span> {threat.severityScore}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
