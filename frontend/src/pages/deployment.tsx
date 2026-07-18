import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Check, Copy, MessageSquare, Rocket } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { useToast } from "@/components/toast"

type DeployStatus = "not_deployed" | "deploying" | "live"

export function DeploymentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [status, setStatus] = useState<DeployStatus>("not_deployed")
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  const endpointUrl = `https://your-username-${id ?? "project"}.hf.space`

  const deploy = () => {
    setStatus("deploying")
    setProgress(0)
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10
        if (next >= 100) {
          clearInterval(timer)
          setStatus("live")
          toast({ type: "success", title: "Model deployed", description: "Your endpoint is live." })
          return 100
        }
        return next
      })
    }, 250)
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(endpointUrl)
    setCopied(true)
    toast({ type: "success", title: "Copied to clipboard" })
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title="Deployment"
        description="Deploy your fine-tuned model behind a live inference endpoint."
        breadcrumbs={[
          { label: "Projects", to: "/" },
          { label: "Evaluate", to: `/projects/${id}/evaluate` },
          { label: "Deploy" },
        ]}
        meta={
          <StatusBadge
  status={
    status === "live"
      ? "live"
      : status === "deploying"
      ? "deploying"
      : "not_deployed"
  }
/>
        }
        actions={
          status === "live" ? (
            <Button onClick={() => navigate(`/projects/${id}/chat`)}>
              <MessageSquare className="h-4 w-4" />
              Open chat playground
            </Button>
          ) : undefined
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Inference endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          {status === "not_deployed" && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <p className="max-w-sm text-sm text-muted-foreground">
                Deploys the fine-tuned adapter to a Hugging Face Space and gives you a live endpoint to chat
                with.
              </p>
              <Button onClick={deploy}>
                <Rocket className="h-4 w-4" />
                Deploy model
              </Button>
            </div>
          )}

          {status === "deploying" && (
            <div className="py-10">
              <div className="mb-3 text-center text-sm text-muted-foreground">
                Building container and loading model weights…
              </div>
              <div className="mx-auto h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {status === "live" && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <code className="truncate text-sm text-foreground/90">{endpointUrl}</code>
              <Button variant="ghost" onClick={copyUrl}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Base model</dt>
              <dd className="text-sm text-foreground/90">meta-llama/Llama-3.2-1B</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Adapter</dt>
              <dd className="text-sm text-foreground/90">LoRA · r=16</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Hosting</dt>
              <dd className="text-sm text-foreground/90">Hugging Face Spaces · CPU Basic</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Status</dt>
              <dd className="text-sm text-foreground/90">
                {status === "live" ? "Running" : status === "deploying" ? "Starting up" : "Stopped"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
