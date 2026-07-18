import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Columns2, Send, Square } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ChatTurn {
  id: string
  prompt: string
  baseResponse: string
  tunedResponse: string
}

function mockRespond(prompt: string): { base: string; tuned: string } {
  return {
    base: `I can try to help with "${prompt}", though I don't have specific context on this beyond general knowledge.`,
    tuned: prompt.toLowerCase().includes("refund")
      ? "Refunds are processed within 3–5 business days once the returned item is received."
      : "Based on how we handle this — happy to go into more detail if that's useful.",
  }
}

export function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const [compareMode, setCompareMode] = useState(true)
  const [input, setInput] = useState("")
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [turns, thinking])

  const send = () => {
    const prompt = input.trim()
    if (!prompt || thinking) return
    setInput("")
    setThinking(true)
    setTimeout(() => {
      const { base, tuned } = mockRespond(prompt)
      setTurns((prev) => [
        ...prev,
        { id: crypto.randomUUID(), prompt, baseResponse: base, tunedResponse: tuned },
      ])
      setThinking(false)
    }, 900)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] w-full max-w-4xl flex-col">
      <PageHeader
        title="Chat playground"
        description="Test the deployed model directly."
        breadcrumbs={[
          { label: "Projects", to: "/" },
          { label: "Deploy", to: `/projects/${id}/deploy` },
          { label: "Chat" },
        ]}
        actions={
          <Button variant={compareMode ? "default" : "ghost"} onClick={() => setCompareMode((v) => !v)}>
            <Columns2 className="h-4 w-4" />
            Compare with base model
          </Button>
        }
      />

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
            {turns.length === 0 && !thinking && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <p>Send a message to try your deployed model.</p>
              </div>
            )}

            {turns.map((turn) => (
              <div key={turn.id} className="space-y-2">
                <div className="ml-auto max-w-[80%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                  {turn.prompt}
                </div>

                {compareMode ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg bg-secondary/30 p-3">
                      <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Base model</p>
                      <p className="text-sm text-foreground/90">{turn.baseResponse}</p>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-3 ring-1 ring-primary/20">
                      <p className="mb-1 text-xs font-medium uppercase text-primary">Fine-tuned model</p>
                      <p className="text-sm text-foreground/90">{turn.tunedResponse}</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[80%] rounded-lg bg-secondary/30 p-3">
                    <p className="text-sm text-foreground/90">{turn.tunedResponse}</p>
                  </div>
                )}
              </div>
            ))}

            {thinking && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Square className="h-2 w-2 animate-pulse fill-current" />
                <span className="animate-pulse">Generating…</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask something…"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button onClick={send} disabled={!input.trim() || thinking}>
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
