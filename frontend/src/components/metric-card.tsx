import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: string
  hint?: string
  trend?: "up" | "down" | "neutral"
  trendLabel?: string
  trendPositive?: boolean
}

export function MetricCard({ label, value, hint, trend, trendLabel, trendPositive }: MetricCardProps) {
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="font-mono text-2xl font-semibold tracking-tight">{value}</span>
        {trend && trendLabel && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              trendPositive ? "text-success" : "text-destructive",
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {trendLabel}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  )
}
