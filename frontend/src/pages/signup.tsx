import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Check, Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/toast"
import { cn } from "@/lib/utils"

export function SignupPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const rules = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "One number", ok: /\d/.test(password) },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
  ]

  function validate() {
    const next: typeof errors = {}
    if (!name.trim()) next.name = "Name is required."
    if (!email) next.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address."
    if (!rules.every((r) => r.ok)) next.password = "Password does not meet all requirements."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    toast({ type: "success", title: "Account created", description: "Welcome to TuneForge." })
    navigate("/")
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start fine-tuning open-source models in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Alex Rivera"
            value={name}
            invalid={!!errors.name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            invalid={!!errors.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={password}
              invalid={!!errors.password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <ul className="mt-2 grid gap-1">
            {rules.map((r) => (
              <li key={r.label} className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full",
                    r.ok ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Check className="h-3 w-3" />
                </span>
                <span className={r.ok ? "text-foreground" : "text-muted-foreground"}>{r.label}</span>
              </li>
            ))}
          </ul>
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <Button type="submit" className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}
