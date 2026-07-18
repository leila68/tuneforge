import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/toast"

export function SettingsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [email] = useState("you@example.com") // TODO: load from auth context
  const [name, setName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    toast({ type: "success", title: "Profile updated" })
  }

  const changePassword = (e: FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast({ type: "warning", title: "Password too short", description: "Use at least 8 characters." })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ type: "warning", title: "Passwords don't match" })
      return
    }
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    toast({ type: "success", title: "Password changed" })
  }

  const signOut = () => {
    // TODO: clear auth token / session
    navigate("/login")
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <PageHeader
        title="Settings"
        description="Manage your account."
        breadcrumbs={[{ label: "Projects", to: "/" }, { label: "Settings" }]}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">Email</label>
              <input
                value={email}
                disabled
                className="w-full rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button type="submit">Update password</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-foreground">Sign out</p>
            <p className="text-sm text-muted-foreground">End your current session on this device.</p>
          </div>
          <Button variant="ghost" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
