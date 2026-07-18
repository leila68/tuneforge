import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Rocket, Cpu, Clock, DollarSign } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/toast"
import { BASE_MODELS } from "@/lib/api"
import type { TrainingConfig } from "@/lib/types"
import { cn } from "@/lib/utils"

const LR_STEPS = [1e-5, 2e-5, 5e-5, 1e-4, 2e-4, 3e-4]

export function TrainingConfigPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [config, setConfig] = useState<TrainingConfig>({
    baseModel: BASE_MODELS[0].name,
    method: "QLoRA",
    learningRate: 2e-4,
    loraRank: 16,
    epochs: 3,
    batchSize: 8,
  })

  function set<K extends keyof TrainingConfig>(key: K, value: TrainingConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }))
  }

  const estimate = useMemo(() => {
    const rankFactor = config.loraRank / 16
    const baseHours = config.method === "QLoRA" ? 0.8 : 1.3
    const hours = baseHours * config.epochs * (config.batchSize / 8 ? 1 : 1) * rankFactor
    const gpuHourRate = 2.4
    return {
      hours: hours.toFixed(1),
      cost: (hours * gpuHourRate).toFixed(2),
      gpu: config.method === "QLoRA" ? "1x A100 40GB" : "1x A100 80GB",
    }
  }, [config])

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Training configuration"
        description="Pick a base model and tune the LoRA hyperparameters for this run."
        breadcrumbs={[{ label: "Projects", to: "/" }, { label: "Train" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Base model</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {BASE_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => set("baseModel", m.name)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
                    config.baseModel === m.name
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50 hover:bg-secondary/40",
                  )}
                >
                  <span className="font-mono text-sm">{m.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {m.params} params &middot; {m.contextWindow} ctx &middot; {m.license}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fine-tuning method</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {(["QLoRA", "LoRA"] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => set("method", method)}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors",
                    config.method === method
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50 hover:bg-secondary/40",
                  )}
                >
                  <span className="text-sm font-medium">{method}</span>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {method === "QLoRA"
                      ? "4-bit quantized. Lower memory, great default."
                      : "Full-precision adapters. Slightly higher quality."}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hyperparameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Field
                label="Learning rate"
                value={config.learningRate.toExponential(0)}
              >
                <Slider
                  min={0}
                  max={LR_STEPS.length - 1}
                  value={LR_STEPS.indexOf(config.learningRate)}
                  onChange={(i) => set("learningRate", LR_STEPS[i])}
                />
              </Field>
              <Field label="LoRA rank" value={String(config.loraRank)}>
                <Slider
                  min={4}
                  max={64}
                  step={4}
                  value={config.loraRank}
                  onChange={(v) => set("loraRank", v)}
                />
              </Field>
              <Field label="Epochs" value={String(config.epochs)}>
                <Slider min={1} max={10} value={config.epochs} onChange={(v) => set("epochs", v)} />
              </Field>
              <Field label="Batch size" value={String(config.batchSize)}>
                <Slider
                  min={1}
                  max={32}
                  step={1}
                  value={config.batchSize}
                  onChange={(v) => set("batchSize", v)}
                />
              </Field>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle>Run estimate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EstimateRow icon={Cpu} label="GPU" value={estimate.gpu} />
              <EstimateRow icon={Clock} label="Est. duration" value={`~${estimate.hours} hrs`} />
              <EstimateRow icon={DollarSign} label="Est. cost" value={`$${estimate.cost}`} />
              <div className="border-t border-border pt-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    toast({
                      type: "success",
                      title: "Training started",
                      description: "Your job has been queued.",
                    })
                    navigate(`/projects/${id}/monitor`)
                  }}
                >
                  <Rocket className="h-4 w-4" />
                  Start training
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Estimates are approximate and billed per GPU-hour.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label>{label}</Label>
        <span className="font-mono text-sm text-muted-foreground">{value}</span>
      </div>
      {children}
    </div>
  )
}

function EstimateRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Cpu
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="font-mono text-sm font-medium">{value}</span>
    </div>
  )
}
