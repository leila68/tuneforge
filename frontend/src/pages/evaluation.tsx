import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/metric-card"
import { StatusBadge } from "@/components/status-badge"
import { useToast } from "@/components/toast"

type EvalStatus = "running" | "completed"

interface EvalExample {
  id: string
  prompt: string
  baseResponse: string
  tunedResponse: string
}

interface EvalMetrics {
  accuracy: number
  avgQuality: number
}

interface EvalResult {
  base: EvalMetrics
  tuned: EvalMetrics
  examples: EvalExample[]
}

function generateEvalResult(): EvalResult {
  return {
    base: { accuracy: 0.61, avgQuality: 3.1 },
    tuned: { accuracy: 0.87, avgQuality: 4.4 },
    examples: [
      {
        id: "1",
        prompt: "What's your return policy for opened electronics?",
        baseResponse:
          "I'm not sure about specific return policies. You may want to check the store's website or contact support directly.",
        tunedResponse:
          "Opened electronics can be returned within 15 days if all original packaging and accessories are included. A 15% restocking fee applies unless the item is defective.",
      },
      {
        id: "2",
        prompt: "Can I expedite shipping on an order that already shipped?",
        baseResponse:
          "Once an order has shipped, shipping speed usually can't be changed. Contact the shipping carrier for options.",
        tunedResponse:
          "Once an order leaves our warehouse we can't change the shipping method, but we can arrange a discounted next-day reorder if the original arrives late — I can start that for you.",
      },
      {
        id: "3",
        prompt: "Do you price match with other retailers?",
        baseResponse:
          "Some retailers offer price matching. I don't have information on this specific company's policy.",
        tunedResponse:
          "Yes — we price match within 7 days of purchase for identical, in-stock items from major retailers. Send the competitor link and your order number to start a claim.",
      },
    ],
  }
}

export function EvaluationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [status, setStatus] = useState<EvalStatus>("running")
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<EvalResult | null>(null)

  const runEvaluation = () => {
    setStatus("running")
    setProgress(0)
    setResult(null)
  }

  useEffect(() => {
    runEvaluation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (status !== "running") return
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 8
        if (next >= 100) {
          clearInterval(timer)
          setStatus("completed")
          setResult(generateEvalResult())
          toast({
            type: "success",
            title: "Evaluation complete",
            description: "Fine-tuned model outperformed the base model.",
          })
          return 100
        }
        return next
      })
    }, 220)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const delta = result ? result.tuned.accuracy - result.base.accuracy : 0

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Evaluation & comparison"
        description="Base model vs. fine-tuned model, measured on a held-out set."
        breadcrumbs={[
          { label: "Projects", to: "/" },
          { label: "Monitor", to: `/projects/${id}/monitor` },
          { label: "Evaluate" },
        ]}
        meta={
          <StatusBadge
            status={status === "running" ? "evaluating" : "completed"}
          />
        }
        actions={
          status === "completed" ? (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={runEvaluation}>
                <RefreshCw className="h-4 w-4" />
                Re-run
              </Button>
              <Button onClick={() => navigate(`/projects/${id}/deploy`)}>
                Deploy model
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : undefined
        }
      />

      {status === "running" && (
        <Card className="mb-6">
          <CardContent className="py-10">
            <div className="mb-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Running held-out examples against both models…
            </div>
            <div className="mx-auto h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Base accuracy"
              value={`${Math.round(result.base.accuracy * 100)}%`}
              hint="held-out set"
            />
            <MetricCard
              label="Fine-tuned accuracy"
              value={`${Math.round(result.tuned.accuracy * 100)}%`}
              hint="held-out set"
            />
            <MetricCard
              label="Improvement"
              value={`${delta >= 0 ? "+" : ""}${Math.round(delta * 100)}pp`}
              hint="accuracy delta"
            />
            <MetricCard
              label="Avg. quality"
              value={`${result.tuned.avgQuality.toFixed(1)} / 5`}
              hint={`vs ${result.base.avgQuality.toFixed(1)} / 5 base`}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Example comparisons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.examples.map((ex) => (
                <div key={ex.id} className="rounded-lg border border-border p-4">
                  <p className="mb-3 text-sm font-medium text-foreground">{ex.prompt}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md bg-secondary/30 p-3">
                      <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Base model</p>
                      <p className="text-sm text-foreground/90">{ex.baseResponse}</p>
                    </div>
                    <div className="rounded-md bg-primary/5 p-3 ring-1 ring-primary/20">
                      <p className="mb-1 text-xs font-medium uppercase text-primary">Fine-tuned model</p>
                      <p className="text-sm text-foreground/90">{ex.tunedResponse}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
