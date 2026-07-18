import { Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/components/layout/app-layout"
import { LoginPage } from "@/pages/login"
import { SignupPage } from "@/pages/signup"
import { DashboardPage } from "@/pages/dashboard"
import { NewProjectPage } from "@/pages/new-project"
import { DatasetPage } from "@/pages/dataset"
import { TrainingConfigPage } from "@/pages/training-config"
import { TrainingMonitorPage } from "@/pages/training-monitor"
import { EvaluationPage } from "@/pages/evaluation"
import { DeploymentPage } from "@/pages/deployment"
import { ChatPage } from "@/pages/chat"
import { SettingsPage } from "@/pages/setting"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects/new" element={<NewProjectPage />} />
        <Route path="/projects/:id/dataset" element={<DatasetPage />} />
        <Route path="/projects/:id/train" element={<TrainingConfigPage />} />
        <Route path="/projects/:id/monitor" element={<TrainingMonitorPage />} />
        <Route path="/projects/:id/evaluate" element={<EvaluationPage />} />
        <Route path="/projects/:id/deploy" element={<DeploymentPage />} />
        <Route path="/projects/:id/chat" element={<ChatPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
