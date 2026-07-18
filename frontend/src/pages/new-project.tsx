import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatasetDropzone, type UploadedFile } from "@/components/dataset-dropzone"
import { DatasetPreview } from "@/components/dataset-preview"
import { useToast } from "@/components/toast"
import { cn } from "@/lib/utils"

const STEPS = ["Name project", "Upload dataset", "Review & validate"]

export function NewProjectPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [nameError, setNameError] = useState<string | null>(null)
  const [file, setFile] = useState<UploadedFile | null>(null)

  function next() {
    if (step === 0) {
      if (name.trim().length < 3) {
        setNameError("Project name must be at least 3 characters.")
        return
      }
      setNameError(null)
    }
    if (step === 1 && !file) {
      toast({ type: "warning", title: "Add a dataset", description: "Upload a file to continue." })
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function finish() {
    toast({ type: "success", title: "Project created", description: `${name} is ready to train.` })
    navigate("/projects/prj_new/train")
  }

  return (
    <div>
      <PageHeader
        title="New project"
        description="Name your project, upload a dataset, and confirm it parses cleanly."
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Button>
        }
      />

      <Stepper step={step} />

      <Card className="mt-6">
        <CardContent className="pt-5">
          {step === 0 && (
            <div className="max-w-md space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                placeholder="e.g. Support Assistant"
                value={name}
                invalid={!!nameError}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              {nameError ? (
                <p className="text-xs text-destructive">{nameError}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  A short, human-readable name. You can rename it later.
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Upload an instruction-tuning dataset. Each record should contain an instruction,
                optional input, and the expected output.
              </p>
              <DatasetDropzone file={file} onFile={setFile} onClear={() => setFile(null)} />
            </div>
          )}

          {step === 2 && <DatasetPreview />}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={finish}>
            <Check className="h-4 w-4" />
            Create project
          </Button>
        )}
      </div>
    </div>
  )
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {STEPS.map((label, i) => {
        const done = i < step
        const active = i === step
        return (
          <li key={label} className="flex flex-1 items-center gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="hidden h-px flex-1 bg-border sm:block" aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )
}
