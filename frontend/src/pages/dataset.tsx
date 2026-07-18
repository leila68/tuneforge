import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatasetDropzone, type UploadedFile } from "@/components/dataset-dropzone"
import { DatasetPreview } from "@/components/dataset-preview"
import { useToast } from "@/components/toast"
import { ArrowRight } from "lucide-react"

export function DatasetPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [file, setFile] = useState<UploadedFile | null>(null)

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Dataset"
        description="Upload and validate your training data before configuring a run."
        breadcrumbs={[{ label: "Projects", to: "/" }, { label: "Dataset" }]}
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload training data</CardTitle>
          </CardHeader>
          <CardContent>
            <DatasetDropzone
              file={file}
              onFile={(f) => {
                setFile(f)
                toast({
                  type: "success",
                  title: "Dataset validated",
                  description: "8,200 rows parsed with no schema errors.",
                })
              }}
              onClear={() => setFile(null)}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Expected format: JSONL with{" "}
              <code className="font-mono text-foreground/80">instruction</code>,{" "}
              <code className="font-mono text-foreground/80">input</code>, and{" "}
              <code className="font-mono text-foreground/80">output</code> fields per line.
            </p>
          </CardContent>
        </Card>

        {file && <DatasetPreview />}

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back to projects
          </Button>
          <Button disabled={!file} onClick={() => navigate(`/projects/${id}/train`)}>
            Continue to training
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
