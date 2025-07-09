import { AnalyzeView } from "@/components/analyze-view"

export default function AnalyzePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Threat Analysis</h1>
        <p className="text-muted-foreground">Analyze new threat descriptions using machine learning</p>
      </div>

      <AnalyzeView />
    </div>
  )
}
