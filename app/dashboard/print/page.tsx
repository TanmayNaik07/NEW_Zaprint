import { PrintUploader } from "@/components/dashboard/print-uploader"
import { PrintSpecifications } from "@/components/dashboard/print-specifications"
import { PrintSummary } from "@/components/dashboard/print-summary"

export default function PrintPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">Start a New Print</h1>
        <p className="text-muted-foreground">Upload your document and customize your print settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <PrintUploader />
          <PrintSpecifications />
        </div>

        {/* Sidebar - Summary */}
        <div className="lg:col-span-1">
          <PrintSummary />
        </div>
      </div>
    </div>
  )
}
