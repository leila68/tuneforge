import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, FolderGit2, Layers, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/status-badge"
import { EmptyState } from "@/components/empty-state"
import { ErrorState } from "@/components/error-state"
import { useAsync } from "@/lib/use-async"
import { api } from "@/lib/api"
import { formatRelativeTime } from "@/lib/utils"
import type { Project } from "@/lib/types"

const nextStage: Record<Project["status"], string> = {
  draft: "dataset",
  training: "monitor",
  evaluating: "evaluate",
  deployed: "chat",
}

export function DashboardPage() {
  const { data, loading, error, reload } = useAsync(() => api.getProjects(), [])
  const [showEmpty, setShowEmpty] = useState(false)
  const navigate = useNavigate()

  const projects = showEmpty ? [] : data ?? []

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Every fine-tuning run, from raw dataset to deployed endpoint."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmpty((v) => !v)}
              title="Preview the empty state"
            >
              {showEmpty ? "Show demo data" : "Preview empty state"}
            </Button>
            <Button size="sm" onClick={() => navigate("/projects/new")}>
              <Plus className="h-4 w-4" />
              New project
            </Button>
          </>
        }
      />

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-3 h-4 w-48" />
              <Skeleton className="mt-6 h-6 w-24" />
            </Card>
          ))}
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && projects.length === 0 && (
        <EmptyState
          icon={FolderGit2}
          title="No projects yet"
          description="Create your first project to upload a dataset, fine-tune a base model, and ship it behind a chat endpoint."
          action={
            <Button onClick={() => navigate("/projects/new")}>
              <Plus className="h-4 w-4" />
              New project
            </Button>
          }
        />
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}/${nextStage[p.status]}`}
              className="group focus-visible:outline-none"
            >
              <Card className="flex h-full flex-col p-5 transition-colors hover:border-primary/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                      <Layers className="h-4 w-4" />
                    </span>
                    <h3 className="font-semibold leading-tight">{p.name}</h3>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Base model</dt>
                    <dd className="truncate font-mono text-xs">{p.baseModel}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Method</dt>
                    <dd className="font-mono text-xs">{p.method}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Dataset</dt>
                    <dd className="font-mono text-xs">
                      {p.datasetRows > 0 ? `${p.datasetRows.toLocaleString()} rows` : "—"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
                  <span>Updated {formatRelativeTime(p.updatedAt)}</span>
                  <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
