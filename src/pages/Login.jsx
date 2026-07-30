import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputStyles =
  'w-full rounded-md border border-secondary-light bg-white px-4 py-2 text-sm text-neutral-700 focus:border-accent-blue focus:outline-none'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const success = login(username.trim(), password)
    if (!success) {
      setError('Usuário ou senha incorretos.')
      return
    }

    setError('')
    const redirectTo = location.state?.from?.pathname ?? '/'
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm rounded-xl border border-secondary-light bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-primary">
          Aquário de Ideias
        </h1>
        <p className="mt-1 text-center text-sm text-neutral-500">
          Entre com suas credenciais para continuar.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Usuário
            </label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={inputStyles}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputStyles}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
