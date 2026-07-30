import { createContext, useContext, useEffect, useState } from 'react'

/*
 * Autenticação simples e temporária: usuário/senha ficam salvos em
 * texto simples no localStorage do navegador, sem backend nem
 * criptografia. Isso é suficiente apenas para uso interno provisório
 * e deve ser substituído por autenticação real (ex.: Supabase Auth)
 * antes de qualquer uso em produção.
 */

const CREDENTIALS_KEY = 'aquario_credentials'
const SESSION_KEY = 'aquario_session'

const DEFAULT_CREDENTIALS = { username: 'admin', password: '123456' }

function loadCredentials() {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (!parsed?.username || !parsed?.password) return DEFAULT_CREDENTIALS
    return parsed
  } catch {
    return DEFAULT_CREDENTIALS
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [credentials, setCredentials] = useState(loadCredentials)
  const [username, setUsername] = useState(() => localStorage.getItem(SESSION_KEY))

  useEffect(() => {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials))
  }, [credentials])

  function login(user, password) {
    if (user === credentials.username && password === credentials.password) {
      localStorage.setItem(SESSION_KEY, user)
      setUsername(user)
      return true
    }
    return false
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUsername(null)
  }

  function changeCredentials({ currentPassword, newUsername, newPassword }) {
    if (currentPassword !== credentials.password) {
      return { success: false, error: 'Senha atual incorreta.' }
    }

    const updated = {
      username: newUsername?.trim() ? newUsername.trim() : credentials.username,
      password: newPassword ? newPassword : credentials.password,
    }
    setCredentials(updated)

    if (username) {
      localStorage.setItem(SESSION_KEY, updated.username)
      setUsername(updated.username)
    }

    return { success: true }
  }

  const value = {
    isAuthenticated: Boolean(username),
    username,
    login,
    logout,
    changeCredentials,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
