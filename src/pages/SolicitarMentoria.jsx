import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialForm = {
  nomeStartup: '',
  preferenciaHorario: 'Manhã',
  nomeResponsavel: '',
  whatsappResponsavel: '',
  emailResponsavel: '',
  temaMentoria: '',
  necessidade: '',
  urgencia: 'Média',
}

const inputStyles =
  'w-full rounded-md border border-secondary-light bg-white px-4 py-2 text-sm text-neutral-700 focus:border-accent-blue focus:outline-none'

export default function SolicitarMentoria() {
  const [form, setForm] = useState(initialForm)
  const [enviado, setEnviado] = useState(false)

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setEnviado(true)
    setForm(initialForm)
  }

  return (
    <section className="mx-auto max-w-2xl">
      <Link
        to="/mentorias"
        className="text-sm font-medium text-accent-blue hover:underline"
      >
        ← Voltar para Mentorias
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-primary">
        Solicitação de Mentoria
      </h1>
      <p className="mt-2 text-neutral-600">
        Preencha os dados abaixo para solicitar uma mentoria para a sua
        startup.
      </p>

      {enviado && (
        <div className="mt-6 rounded-md bg-secondary-light px-4 py-3 text-sm font-medium text-primary">
          Solicitação enviada com sucesso! Nossa equipe entrará em contato em
          breve.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-xl border border-secondary-light bg-white p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Nome da Startup
          </label>
          <input
            type="text"
            required
            value={form.nomeStartup}
            onChange={handleChange('nomeStartup')}
            className={inputStyles}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Preferência de horário
          </label>
          <select
            value={form.preferenciaHorario}
            onChange={handleChange('preferenciaHorario')}
            className={inputStyles}
          >
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Nome do responsável
          </label>
          <input
            type="text"
            required
            value={form.nomeResponsavel}
            onChange={handleChange('nomeResponsavel')}
            className={inputStyles}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              WhatsApp do responsável
            </label>
            <input
              type="tel"
              required
              placeholder="(00) 00000-0000"
              value={form.whatsappResponsavel}
              onChange={handleChange('whatsappResponsavel')}
              className={inputStyles}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              E-mail do responsável
            </label>
            <input
              type="email"
              required
              value={form.emailResponsavel}
              onChange={handleChange('emailResponsavel')}
              className={inputStyles}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Tema da mentoria
          </label>
          <input
            type="text"
            required
            value={form.temaMentoria}
            onChange={handleChange('temaMentoria')}
            className={inputStyles}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Necessidade da startup
          </label>
          <textarea
            required
            rows={4}
            value={form.necessidade}
            onChange={handleChange('necessidade')}
            className={inputStyles}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Urgência
          </label>
          <select
            value={form.urgencia}
            onChange={handleChange('urgencia')}
            className={inputStyles}
          >
            <option value="Alta">Alta prioridade</option>
            <option value="Média">Média prioridade</option>
            <option value="Baixa">Baixa prioridade</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Enviar solicitação
        </button>
      </form>
    </section>
  )
}
