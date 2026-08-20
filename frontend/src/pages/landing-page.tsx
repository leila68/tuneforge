import { useNavigate } from "react-router-dom"
import { Boxes, Moon, Sun, UploadCloud, SlidersHorizontal, BarChart3, MessageSquare, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/lib/theme"
import { useAuth } from "@/lib/auth"

const features = [
  {
    icon: UploadCloud,
    title: "Upload a dataset",
    description: "Bring your own data, or start from a sample set, to shape a model around your task.",
  },
  {
    icon: SlidersHorizontal,
    title: "Fine-tune with LoRA/QLoRA",
    description: "Configure and run a parameter-efficient fine-tuning job on an open-source base model.",
  },
  {
    icon: BarChart3,
    title: "Evaluate against the base model",
    description: "Compare outputs side-by-side and see quantitative eval metrics before you ship anything.",
  },
  {
    icon: MessageSquare,
    title: "Chat with the result",
    description: "Deploy the fine-tuned model behind a live chat interface once you're happy with it.",
  },
]

export function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Boxes className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">TuneForge</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <Button size="sm" onClick={() => navigate("/dashboard")}>
              Go to dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate("/signup")}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-5 pb-16 pt-16 text-center sm:pt-24">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Fine-tune open-source LLMs, end to end.
          </h1>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Upload a dataset, fine-tune with LoRA/QLoRA, evaluate against the base model, and deploy behind a chat
            interface — all in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate("/projects/new")}>
              Try it now, no sign-up needed
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-5 pb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title} className="p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                  <f.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 font-semibold leading-tight">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground text-pretty">{f.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Why I built this */}
        <section className="mx-auto max-w-3xl px-5 pb-24">
          <Card className="p-6 sm:p-8">
            <h2 className="font-semibold">Why I built this</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
              TuneForge is a portfolio project built to show full-stack and applied ML engineering together — a
              custom-built JWT auth system and Slurm job orchestration alongside proven tools like Axolotl/Unsloth
              for training. Training jobs run on free academic HPC (DRAC); everything else runs on free-tier infra.
              The whole app works without an account — sign up only if you want your projects to persist across
              devices.
            </p>
          </Card>
        </section>
      </main>
    </div>
  )
}