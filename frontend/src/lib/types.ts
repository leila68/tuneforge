export type ProjectStatus = "draft" | "training" | "evaluating" | "deployed"

export interface Project {
  id: string
  name: string
  baseModel: string
  status: ProjectStatus
  updatedAt: string
  method: "LoRA" | "QLoRA"
  datasetRows: number
}

export interface DatasetRow {
  instruction: string
  input: string
  output: string
}

export interface BaseModel {
  id: string
  name: string
  params: string
  license: string
  contextWindow: string
}

export interface TrainingConfig {
  baseModel: string
  method: "LoRA" | "QLoRA"
  learningRate: number
  loraRank: number
  epochs: number
  batchSize: number
}

export interface LossPoint {
  step: number
  epoch: number
  trainingLoss: number
  validationLoss: number | null
}

export interface LogLine {
  ts: string
  level: "info" | "warn" | "error" | "success"
  message: string
}

export type JobStatus = "queued" | "running" | "completed" | "failed" | "cancelled"

export interface EvalMetric {
  label: string
  base: number
  finetuned: number
  unit?: string
  higherIsBetter: boolean
}

export interface EvalSample {
  id: string
  prompt: string
  baseResponse: string
  finetunedResponse: string
}

export type DeploymentState = "not_deployed" | "deploying" | "live"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  variant?: "base" | "finetuned"
}
