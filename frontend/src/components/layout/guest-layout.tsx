import { Outlet } from "react-router-dom"
import { Topbar } from "./topbar"

export function GuestLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Topbar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}