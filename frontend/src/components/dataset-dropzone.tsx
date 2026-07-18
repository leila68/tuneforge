import { useCallback, useRef, useState } from "react"
import { UploadCloud, FileJson, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const ACCEPTED = [".jsonl", ".json", ".csv"]
const MAX_MB = 50

export interface UploadedFile {
  name: string
  sizeBytes: number
}

export function DatasetDropzone({
  file,
  onFile,
  onClear,
}: {
  file: UploadedFile | null
  onFile: (f: UploadedFile) => void
  onClear: () => void
}) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      setError(null)
      if (!files || files.length === 0) return
      const f = files[0]
      const ext = "." + f.name.split(".").pop()?.toLowerCase()
      if (!ACCEPTED.includes(ext)) {
        setError(`Unsupported file type. Use ${ACCEPTED.join(", ")}.`)
        return
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setError(`File is too large. Maximum size is ${MAX_MB} MB.`)
        return
      }
      onFile({ name: f.name, sizeBytes: f.size })
    },
    [onFile],
  )

  if (file) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileJson className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(file.sizeBytes)}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClear} aria-label="Remove file">
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/30",
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <UploadCloud className="h-6 w-6" />
        </span>
        <p className="mt-4 text-sm font-medium">
          Drag &amp; drop your dataset, or <span className="text-primary">browse</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {ACCEPTED.join(", ")} up to {MAX_MB} MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
