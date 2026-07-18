import { cn } from "@/lib/utils"

interface SliderProps {
  id?: string
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  className?: string
}

export function Slider({ id, min, max, step = 1, value, onChange, className }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn("slider-input h-1.5 w-full cursor-pointer appearance-none rounded-full", className)}
      style={{
        background: `linear-gradient(to right, hsl(var(--primary)) ${pct}%, hsl(var(--secondary)) ${pct}%)`,
      }}
    />
  )
}
