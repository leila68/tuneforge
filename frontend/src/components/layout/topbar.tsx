import { useEffect, useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Menu, Boxes, Moon, Sun, User, LogOut, Settings as SettingsIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

export function Topbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

           <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Boxes className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">TuneForge</span>
        </Link>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 text-sm transition-colors hover:bg-secondary"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </span>
              <span className="hidden font-medium sm:inline">{user.fullName ?? user.email}</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:inline" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 animate-fade-in overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.fullName ?? "Account"}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="my-1 h-px bg-border" />
                <MenuItem
                  icon={SettingsIcon}
                  label="Settings"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate("/settings")
                  }}
                />
                <MenuItem
                  icon={LogOut}
                  label="Sign out"
                  destructive
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                    navigate("/")
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button size="sm" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  destructive,
}: {
  icon: typeof User
  label: string
  onClick: () => void
  destructive?: boolean
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary",
        destructive ? "text-destructive" : "text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}