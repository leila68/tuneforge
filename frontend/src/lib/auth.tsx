import { createContext, useContext, useState, type ReactNode } from "react"

type AuthUser = {
  id: string
  email: string
  fullName?: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Stub: starts logged-out. Swap this for real token/localStorage
  // read + /auth/me call when backend auth is wired up — nothing
  // outside this file needs to change.
  const [user, setUser] = useState<AuthUser | null>(null)

  const login = (user: AuthUser) => setUser(user)
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}