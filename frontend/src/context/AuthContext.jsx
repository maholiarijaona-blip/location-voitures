import { createContext, useCallback, useContext, useState } from 'react'
import { authApi } from '../api/resources'

const AuthContext = createContext(null)

function lireSession() {
  try {
    const brut = localStorage.getItem('user')
    return brut && localStorage.getItem('token') ? JSON.parse(brut) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(lireSession)

  const ouvrirSession = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const login = useCallback(async (username, password) => {
    const { data } = await authApi.login(username, password)
    return ouvrirSession(data)
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload)
    return ouvrirSession(data)
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isAdmin: user?.role === 'admin', login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
