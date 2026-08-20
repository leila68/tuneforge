import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CircleStop, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/metric-card"
import { LossChart, ChartLegend } from "@/components/loss-chart"
import { StatusBadge } from "@/components/status-badge"
import { Modal } from "@/components/ui/modal"
import { useToast } from "@/components/toast"
import { generateLossCurve } from "@/lib/api"
import type { LogLine, LossPoint } from "@/lib/types"
import { cn } from "@/lib/utils"

const TOTAL_STEPS = 120
const FULL_CURVE = generateLossCurve(TOTAL_STEPS)

const LOG_TEMPLATES: Array<Omit<LogLine, "ts">> = [
  { level: "info", message: "Loading base model weights (4-bit)…" },
  { level: "info", message: "Tokenizing dataset · 8,200 examples" },
  { level: "success", message: "Adapter injected · trainable params 0.42%" },
  { level: "info", message: "Starting epoch 1/3" },
  { level: "info", message: "Gradient checkpointing enabled" },
  { level: "warn", message: "18 sequences truncated to 2048 tokens" },
  { level: "info", message: "Checkpoint saved to /ckpt/step-40" },
  { level: "info", message: "Starting epoch 2/3" },
  { level: "info", message: "Eval loss improved: 0.74 → 0.66" },
  { level: "info", message: "Starting epoch 3/3" },
]

export function TrainingMonitorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<"running" | "completed" | "cancelled">("running")
  const [curve, setCurve] = useState<LossPoint[]>([])
  const [logs, setLogs] = useState<LogLine[]>([])
  const [showCancel, setShowCancel] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status !== "running") return
    const timer = setInterval(() => {
      setStep((prev) => {
        const nextStep = prev + 2
        if (nextStep >= TOTAL_STEPS) {
          clearInterval(timer)
          setStatus("completed")
          setCurve(FULL_CURVE)
          return TOTAL_STEPS
        }
        setCurve(FULL_CURVE.slice(0, nextStep + 1))
        return nextStep
      })
    }, 400)
    return () => clearInterval(timer)
  }, [status])

  useEffect(() => {
    if (status === "completed") {
      setLogs((prev) => [
        ...prev,
        { ts: now(), level: "success", message: "Training complete · adapter saved" },
      ])
      toast({ type: "success", title: "Training complete", description: "Ready to evaluate." })
      return
    }
    const idx = Math.min(Math.floor(step / 12), LOG_TEMPLATES.length - 1)
    setLogs((prev) => {
      if (prev.length > idx) return prev
      return [...prev, { ts: now(), ...LOG_TEMPLATES[idx] }]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, status])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [logs])

  const pct = Math.round((step / TOTAL_STEPS) * 100)
  const current = curve[curve.length - 1]

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Training monitor"
        description="Live loss curve, metrics, and logs for the active run."
        breadcrumbs={[{ label: "Projects", to: "/" }, { label: "Monitor" }]}
        meta={
          <StatusBadge status={status} />
        }
        actions={
          status === "running" ? (
            <Button variant="destructive" onClick={() => setShowCancel(true)}>
              <CircleStop className="h-4 w-4" />
              Stop
            </Button>
          ) : (
            <Button onClick={() => navigate(`/projects/${id}/evaluate`)}>
              Evaluate model
              <ArrowRight className="h-4 w-4" />
            </Button>
          )
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Progress" value={`${pct}%`} hint={`step ${step} / ${TOTAL_STEPS}`} />
        <MetricCard
          label="Training loss"
          value={current ? current.trainingLoss.toFixed(4) : "—"}
          hint="current step"
        />
        <MetricCard label="Epoch" value={current ? current.epoch.toFixed(2) : "0.00"} hint="of 3.00" />
        <MetricCard label="Throughput" value="1,840" hint="tokens / sec" />
      </div>

      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Loss curve</CardTitle>
          <ChartLegend />
        </CardHeader>
        <CardContent>
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <LossChart data={curve} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={logRef}
            className="scrollbar-thin h-56 overflow-y-auto rounded-lg border border-border bg-secondary/30 p-3 font-mono text-xs"
          >
            {logs.map((line, i) => (
              <div key={i} className="flex gap-3 py-0.5">
                <span className="shrink-0 text-muted-foreground">{line.ts}</span>
                <span className={cn("shrink-0 uppercase", LEVEL_COLOR[line.level])}>
                  {line.level}
                </span>
                <span className="text-foreground/90">{line.message}</span>
              </div>
            ))}
            {status === "running" && (
              <div className="py-0.5 text-muted-foreground">
                <span className="animate-pulse">▊ streaming…</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        open={showCancel}
        onClose={() => setShowCancel(false)}
        title="Stop training run?"
        description="This will cancel the job and discard progress since the last checkpoint. This cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCancel(false)}>
              Keep running
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setStatus("cancelled")
                setShowCancel(false)
                setLogs((prev) => [
                  ...prev,
                  { ts: now(), level: "error", message: "Run cancelled by user" },
                ])
                toast({ type: "warning", title: "Training cancelled" })
              }}
            >
              Stop run
            </Button>
          </>
        }
      />
    </div>
  )
}

const LEVEL_COLOR: Record<LogLine["level"], string> = {
  info: "text-info",
  warn: "text-warning",
  error: "text-destructive",
  success: "text-success",
}

function now(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false })
}
