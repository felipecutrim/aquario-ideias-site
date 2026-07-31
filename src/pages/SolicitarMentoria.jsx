import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createMentoria } from '../data/mentorias'
import { isRequired, isValidEmail, isValidPhone } from '../lib/validators'

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

function formatDataSolicitacao() {
  const hoje = new Date()
  const dia = String(hoje.getDate()).padStart(2, '0')
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  return `${dia}/${mes}`
}

export default function SolicitarMentoria() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [enviado, setEnviado] = useState(false)

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }
  }

  function validate() {
    const nextErrors = {}
    if (!isRequired(form.nomeStartup)) {
      nextErrors.nomeStartup = 'Nome da startup é obrigatório.'
    }
    if (!isRequired(form.nomeResponsavel)) {
      nextErrors.nomeResponsavel = 'Nome do responsável é obrigatório.'
    }
    if (!isRequired(form.whatsappResponsavel)) {
      nextErrors.whatsappResponsavel = 'WhatsApp do responsável é obrigatório.'
    } else if (!isValidPhone(form.whatsappResponsavel)) {
      nextErrors.whatsappResponsavel = 'Informe um WhatsApp válido, com DDD.'
    }
    if (!isRequired(form.emailResponsavel)) {
      nextErrors.emailResponsavel = 'E-mail do responsável é obrigatório.'
    } else if (!isValidEmail(form.emailResponsavel)) {
      nextErrors.emailResponsavel =
        'Informe um e-mail válido (ex.: nome@dominio.com).'
    }
    if (!isRequired(form.temaMentoria)) {
      nextErrors.temaMentoria = 'Tema da mentoria é obrigatório.'
    }
    if (!isRequired(form.necessidade)) {
      nextErrors.necessidade = 'Conte um pouco sobre a necessidade da startup.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    const observacoes = [
      `WhatsApp: ${form.whatsappResponsavel}`,
      `E-mail: ${form.emailResponsavel}`,
      `Preferência de horário: ${form.preferenciaHorario}`,
      `Urgência: ${form.urgencia}`,
      `Necessidade: ${form.necessidade}`,
    ].join(' | ')

    try {
      await createMentoria({
        startup: form.nomeStartup,
        responsavelStartup: form.nomeResponsavel,
        area: form.temaMentoria,
        mentor: '',
        dataSolicitacao: formatDataSolicitacao(),
        status: 'Agendada',
        dataAgendamento: '',
        dataMentoria: '',
        relatorioRecebido: '',
        pagamentoMentor: '',
        observacoes,
      })
      setEnviado(true)
      setForm(initialForm)
      setErrors({})
    } catch (err) {
      setSubmitError(err.message ?? 'Erro ao enviar solicitação. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
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

      {submitError && (
        <div className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 space-y-5 rounded-xl border border-secondary-light bg-white p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Nome da Startup
          </label>
          <input
            type="text"
            value={form.nomeStartup}
            onChange={handleChange('nomeStartup')}
            className={inputStyles}
          />
          {errors.nomeStartup && (
            <p className="mt-1 text-xs text-red-600">{errors.nomeStartup}</p>
          )}
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
            value={form.nomeResponsavel}
            onChange={handleChange('nomeResponsavel')}
            className={inputStyles}
          />
          {errors.nomeResponsavel && (
            <p className="mt-1 text-xs text-red-600">
              {errors.nomeResponsavel}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              WhatsApp do responsável
            </label>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              value={form.whatsappResponsavel}
              onChange={handleChange('whatsappResponsavel')}
              className={inputStyles}
            />
            {errors.whatsappResponsavel && (
              <p className="mt-1 text-xs text-red-600">
                {errors.whatsappResponsavel}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              E-mail do responsável
            </label>
            <input
              type="email"
              value={form.emailResponsavel}
              onChange={handleChange('emailResponsavel')}
              className={inputStyles}
            />
            {errors.emailResponsavel && (
              <p className="mt-1 text-xs text-red-600">
                {errors.emailResponsavel}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Tema da mentoria
          </label>
          <input
            type="text"
            value={form.temaMentoria}
            onChange={handleChange('temaMentoria')}
            className={inputStyles}
          />
          {errors.temaMentoria && (
            <p className="mt-1 text-xs text-red-600">{errors.temaMentoria}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Necessidade da startup
          </label>
          <textarea
            rows={4}
            value={form.necessidade}
            onChange={handleChange('necessidade')}
            className={inputStyles}
          />
          {errors.necessidade && (
            <p className="mt-1 text-xs text-red-600">{errors.necessidade}</p>
          )}
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
          disabled={submitting}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? 'Enviando...' : 'Enviar solicitação'}
        </button>
      </form>
    </section>
  )
}
