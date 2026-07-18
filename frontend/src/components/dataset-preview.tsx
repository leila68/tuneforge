import { CheckCircle2, AlertTriangle } from "lucide-react"
import { DataTable, type Column } from "@/components/data-table"
import { useAsync } from "@/lib/use-async"
import { api } from "@/lib/api"
import type { DatasetRow } from "@/lib/types"

const columns: Column<DatasetRow>[] = [
  {
    key: "instruction",
    header: "Instruction",
    mono: true,
    className: "min-w-[220px] max-w-[280px]",
    render: (r) => <span className="line-clamp-2 text-muted-foreground">{r.instruction}</span>,
  },
  {
    key: "input",
    header: "Input",
    mono: true,
    className: "min-w-[200px] max-w-[260px]",
    render: (r) => <span className="line-clamp-2">{r.input}</span>,
  },
  {
    key: "output",
    header: "Output",
    mono: true,
    className: "min-w-[260px] max-w-[360px]",
    render: (r) => <span className="line-clamp-3 text-foreground/90">{r.output}</span>,
  },
]

export function DatasetPreview() {
  const { data, loading, error } = useAsync(() => api.previewDataset(), [])

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <ValidationRow
          state="valid"
          label="Schema"
          detail="instruction / input / output detected"
        />
        <ValidationRow
          state="valid"
          label="Parsed rows"
          detail={loading ? "Parsing…" : `${(data?.total ?? 0).toLocaleString()} rows read`}
        />
        <ValidationRow
          state="warn"
          label="Warnings"
          detail="18 rows exceed 2,048 tokens (will be truncated)"
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div>
          <p className="mb-2 text-sm text-muted-foreground">
            Preview of the first {data?.rows.length ?? 5} parsed rows
          </p>
          <DataTable
            columns={columns}
            rows={data?.rows ?? []}
            loading={loading}
            getRowKey={(_, i) => String(i)}
          />
        </div>
      )}
    </div>
  )
}

function ValidationRow({
  state,
  label,
  detail,
}: {
  state: "valid" | "warn"
  label: string
  detail: string
}) {
  const Icon = state === "valid" ? CheckCircle2 : AlertTriangle
  const color = state === "valid" ? "text-success" : "text-warning"
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border p-3">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  )
}
