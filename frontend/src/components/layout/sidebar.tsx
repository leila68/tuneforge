import { NavLink, useParams } from "react-router-dom"
import {
  LayoutDashboard,
  Settings,
  Database,
  SlidersHorizontal,
  Activity,
  GitCompare,
  Rocket,
  MessageSquare,
  Boxes,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const mainNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/settings", label: "Settings", icon: Settings, end: false },
]

const pipelineNav = [
  { seg: "dataset", label: "Dataset", icon: Database },
  { seg: "train", label: "Training config", icon: SlidersHorizontal },
  { seg: "monitor", label: "Monitor", icon: Activity },
  { seg: "evaluate", label: "Evaluation", icon: GitCompare },
  { seg: "deploy", label: "Deployment", icon: Rocket },
  { seg: "chat", label: "Playground", icon: MessageSquare },
]

function NavItem({
  to,
  label,
  icon: Icon,
  end,
  onNavigate,
}: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </NavLink>
  )
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { id } = useParams()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Boxes className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold tracking-tight">TuneForge</span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto scrollbar-thin px-3 py-4">
        <div className="space-y-1">
          <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Workspace
          </p>
          {mainNav.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={onNavigate} />
          ))}
        </div>

        {id && (
          <div className="space-y-1">
            <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pipeline
            </p>
            {pipelineNav.map((item) => (
              <NavItem
                key={item.seg}
                to={`/projects/${id}/${item.seg}`}
                label={item.label}
                icon={item.icon}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </nav>

      <div className="border-t border-border p-3">
        <p className="rounded-md bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
          Fine-tune, evaluate & deploy open-source LLMs with LoRA / QLoRA.
        </p>
      </div>
    </div>
  )
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-64 animate-fade-in border-r border-border bg-card">
        <div className="absolute right-2 top-2.5 z-10">
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  )
}
