import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { JobStatus, ProjectStatus, DeploymentState } from "@/lib/types"

type AnyStatus = ProjectStatus | JobStatus | DeploymentState

const CONFIG: Record<
  AnyStatus,
  { label: string; variant: BadgeProps["variant"]; dot: string; pulse?: boolean }
> = {
  draft: { label: "Draft", variant: "default", dot: "bg-muted-foreground" },
  training: { label: "Training", variant: "info", dot: "bg-info", pulse: true },
  evaluating: { label: "Evaluating", variant: "warning", dot: "bg-warning", pulse: true },
  deployed: { label: "Deployed", variant: "success", dot: "bg-success" },
  queued: { label: "Queued", variant: "default", dot: "bg-muted-foreground" },
  running: { label: "Running", variant: "info", dot: "bg-info", pulse: true },
  completed: { label: "Completed", variant: "success", dot: "bg-success" },
  failed: { label: "Failed", variant: "destructive", dot: "bg-destructive" },
  cancelled: { label: "Cancelled", variant: "default", dot: "bg-muted-foreground" },
  not_deployed: { label: "Not deployed", variant: "default", dot: "bg-muted-foreground" },
  deploying: { label: "Deploying", variant: "warning", dot: "bg-warning", pulse: true },
  live: { label: "Live", variant: "success", dot: "bg-success", pulse: true },
}

export function StatusBadge({ status, className }: { status: AnyStatus; className?: string }) {
  const cfg = CONFIG[status]
  return (
    <Badge variant={cfg.variant} className={className}>
      <span className="relative flex h-1.5 w-1.5">
        {cfg.pulse && (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", cfg.dot)} />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", cfg.dot)} />
      </span>
      {cfg.label}
    </Badge>
  )
}
