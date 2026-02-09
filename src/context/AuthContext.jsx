import { createContext, useContext, useEffect, useState } from "react"
import authService from "../services/authService"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getCurrentUser().then((userData) => {
      if (userData) setUser(userData)
      setLoading(false)
    })
  }, [])

  const signup = async (data) => {
    await authService.signup(data)
    return login(data)
  }

  const login = async ({ email, password }) => {
    await authService.login({ email, password })
    const userData = await authService.getCurrentUser()
    setUser(userData)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)