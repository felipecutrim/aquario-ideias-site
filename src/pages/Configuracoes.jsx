import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const inputStyles =
  'w-full rounded-md border border-secondary-light bg-white px-4 py-2 text-sm text-neutral-700 focus:border-accent-blue focus:outline-none'

export default function Configuracoes() {
  const { changeCredentials } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'A confirmação não coincide com a nova senha.',
      })
      return
    }

    const result = changeCredentials({ currentPassword, newUsername, newPassword })

    if (!result.success) {
      setMessage({ type: 'error', text: result.error })
      return
    }

    setMessage({ type: 'success', text: 'Credenciais atualizadas com sucesso.' })
    setCurrentPassword('')
    setNewUsername('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <section className="mx-auto max-w-lg">
      <h1 className="text-3xl font-bold text-primary">Configurações</h1>
      <p className="mt-2 text-neutral-600">
        Altere o usuário e a senha de acesso ao site.
      </p>

      {message && (
        <div
          className={`mt-6 rounded-md px-4 py-3 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-secondary-light text-primary'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-xl border border-secondary-light bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Senha atual
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className={inputStyles}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Novo nome de usuário
          </label>
          <input
            type="text"
            placeholder="Deixe em branco para manter o atual"
            value={newUsername}
            onChange={(event) => setNewUsername(event.target.value)}
            className={inputStyles}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Nova senha
          </label>
          <input
            type="password"
            placeholder="Deixe em branco para manter a atual"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className={inputStyles}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Confirmar nova senha
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={inputStyles}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Salvar alterações
        </button>
      </form>
    </section>
  )
}
