import type {
  BaseModel,
  DatasetRow,
  EvalMetric,
  EvalSample,
  LossPoint,
  Project,
} from "./types"

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

/**
 * The real backend isn't wired up yet. Every function here simulates a network
 * request against `${API_BASE_URL}/...` and resolves with realistic mock data
 * after a short, randomized delay so components can exercise loading + error UI.
 */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

function maybeFail(rate = 0) {
  if (rate > 0 && Math.random() < rate) {
    throw new Error("The server responded with an unexpected error. Please try again.")
  }
}

export const BASE_MODELS: BaseModel[] = [
  { id: "llama-3.1-8b", name: "meta-llama/Llama-3.1-8B", params: "8B", license: "Llama 3.1", contextWindow: "128k" },
  { id: "mistral-7b-v0.3", name: "mistralai/Mistral-7B-v0.3", params: "7B", license: "Apache 2.0", contextWindow: "32k" },
  { id: "qwen2.5-7b", name: "Qwen/Qwen2.5-7B", params: "7B", license: "Apache 2.0", contextWindow: "128k" },
  { id: "gemma-2-9b", name: "google/gemma-2-9b", params: "9B", license: "Gemma", contextWindow: "8k" },
  { id: "phi-3.5-mini", name: "microsoft/Phi-3.5-mini-instruct", params: "3.8B", license: "MIT", contextWindow: "128k" },
  { id: "falcon3-7b", name: "tiiuae/Falcon3-7B-Base", params: "7B", license: "Falcon", contextWindow: "32k" },
]

const PROJECTS: Project[] = [
  {
    id: "prj_support_bot",
    name: "Support Assistant",
    baseModel: "meta-llama/Llama-3.1-8B",
    status: "deployed",
    updatedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    method: "QLoRA",
    datasetRows: 12480,
  },
  {
    id: "prj_sql_copilot",
    name: "SQL Copilot",
    baseModel: "Qwen/Qwen2.5-7B",
    status: "training",
    updatedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    method: "LoRA",
    datasetRows: 8200,
  },
  {
    id: "prj_legal_summ",
    name: "Legal Doc Summarizer",
    baseModel: "mistralai/Mistral-7B-v0.3",
    status: "evaluating",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    method: "QLoRA",
    datasetRows: 5400,
  },
  {
    id: "prj_tone_rewriter",
    name: "Brand Tone Rewriter",
    baseModel: "google/gemma-2-9b",
    status: "draft",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    method: "LoRA",
    datasetRows: 0,
  },
]

export const api = {
  async getProjects(): Promise<Project[]> {
    await delay(650 + Math.random() * 500)
    maybeFail()
    return [...PROJECTS]
  },

  async getProject(id: string): Promise<Project | undefined> {
    await delay(400)
    return PROJECTS.find((p) => p.id === id)
  },

  async getBaseModels(): Promise<BaseModel[]> {
    await delay(400)
    return [...BASE_MODELS]
  },

  async previewDataset(): Promise<{ rows: DatasetRow[]; total: number }> {
    await delay(900)
    return {
      total: 8200,
      rows: [
        {
          instruction: "Translate the natural-language request into a SQL query.",
          input: "Show the top 5 customers by total revenue in 2024.",
          output:
            "SELECT c.name, SUM(o.amount) AS revenue FROM customers c JOIN orders o ON o.customer_id = c.id WHERE o.created_at >= '2024-01-01' GROUP BY c.name ORDER BY revenue DESC LIMIT 5;",
        },
        {
          instruction: "Translate the natural-language request into a SQL query.",
          input: "How many active users signed up last week?",
          output:
            "SELECT COUNT(*) FROM users WHERE status = 'active' AND created_at >= NOW() - INTERVAL '7 days';",
        },
        {
          instruction: "Translate the natural-language request into a SQL query.",
          input: "List products that have never been ordered.",
          output:
            "SELECT p.* FROM products p LEFT JOIN order_items oi ON oi.product_id = p.id WHERE oi.id IS NULL;",
        },
        {
          instruction: "Translate the natural-language request into a SQL query.",
          input: "Average order value by month for the current year.",
          output:
            "SELECT DATE_TRUNC('month', created_at) AS month, AVG(amount) FROM orders WHERE created_at >= DATE_TRUNC('year', NOW()) GROUP BY 1 ORDER BY 1;",
        },
        {
          instruction: "Translate the natural-language request into a SQL query.",
          input: "Find duplicate email addresses in the users table.",
          output:
            "SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;",
        },
      ],
    }
  },

  async getLossCurve(): Promise<LossPoint[]> {
    await delay(500)
    return generateLossCurve(120)
  },

  async getEvalMetrics(): Promise<EvalMetric[]> {
    await delay(600)
    return [
      { label: "Exact match", base: 0.41, finetuned: 0.78, unit: "%", higherIsBetter: true },
      { label: "Eval loss", base: 1.84, finetuned: 0.62, higherIsBetter: false },
      { label: "BLEU", base: 0.29, finetuned: 0.57, higherIsBetter: true },
      { label: "Latency p50", base: 940, finetuned: 610, unit: "ms", higherIsBetter: false },
    ]
  },

  async getEvalSamples(): Promise<EvalSample[]> {
    await delay(600)
    return [
      {
        id: "s1",
        prompt: "Count orders placed in the last 24 hours.",
        baseResponse:
          "You can probably use a SELECT statement with COUNT and a WHERE clause on the date column, something like WHERE date > yesterday.",
        finetunedResponse:
          "SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '24 hours';",
      },
      {
        id: "s2",
        prompt: "Get each user's most recent login.",
        baseResponse:
          "SELECT user_id, login_time FROM logins ORDER BY login_time DESC; -- then filter in application code",
        finetunedResponse:
          "SELECT DISTINCT ON (user_id) user_id, login_time FROM logins ORDER BY user_id, login_time DESC;",
      },
      {
        id: "s3",
        prompt: "Total revenue grouped by product category.",
        baseResponse:
          "SELECT category, revenue FROM products; you may need to sum the revenue somehow.",
        finetunedResponse:
          "SELECT p.category, SUM(oi.quantity * oi.unit_price) AS revenue FROM order_items oi JOIN products p ON p.id = oi.product_id GROUP BY p.category ORDER BY revenue DESC;",
      },
    ]
  },
}

export function generateLossCurve(steps: number): LossPoint[] {
  const points: LossPoint[] = []
  for (let i = 0; i <= steps; i++) {
    const epoch = +(i / (steps / 3)).toFixed(2)
    const base = 2.4 * Math.exp(-i / 45) + 0.35
    const noise = (Math.sin(i / 3) + Math.random() - 0.5) * 0.06
    const trainingLoss = +(base + noise).toFixed(4)
    const validationLoss =
      i % 5 === 0 ? +(base + 0.12 + (Math.random() - 0.5) * 0.05).toFixed(4) : null
    points.push({ step: i, epoch, trainingLoss, validationLoss })
  }
  return points
}
