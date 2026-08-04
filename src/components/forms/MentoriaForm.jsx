import { useState } from 'react'
import FormField, { inputStyles } from '../FormField'
import { isRequired, isValidEmail, isValidPhone } from '../../lib/validators'

const emptyForm = {
  startup: '',
  responsavelStartup: '',
  whatsappResponsavel: '',
  emailResponsavel: '',
  area: '',
  mentor: '',
  preferenciaHorario: '',
  urgencia: '',
  status: 'Agendada',
  dataSolicitacao: '',
  dataMentoria: '',
  relatorioRecebido: '',
  observacoes: '',
}

export default function MentoriaForm({ initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValues ?? emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }
  }

  function validate() {
    const nextErrors = {}
    if (!isRequired(form.startup)) {
      nextErrors.startup = 'Startup é obrigatória.'
    }
    if (!isValidEmail(form.emailResponsavel)) {
      nextErrors.emailResponsavel =
        'Informe um e-mail válido (ex.: nome@dominio.com).'
    }
    if (!isValidPhone(form.whatsappResponsavel)) {
      nextErrors.whatsappResponsavel = 'Informe um WhatsApp válido, com DDD.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')
    try {
      await onSubmit(form)
    } catch (err) {
      setSubmitError(err.message ?? 'Erro ao salvar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {submitError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {submitError}
        </p>
      )}

      {form.dataSolicitacao && (
        <p className="text-xs text-neutral-500">
          Data da Solicitação: {form.dataSolicitacao} (preenchida
          automaticamente)
        </p>
      )}

      <FormField label="Startup" required error={errors.startup}>
        <input
          type="text"
          value={form.startup}
          onChange={handleChange('startup')}
          className={inputStyles}
        />
      </FormField>

      <FormField label="Responsável da Startup">
        <input
          type="text"
          value={form.responsavelStartup}
          onChange={handleChange('responsavelStartup')}
          className={inputStyles}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="WhatsApp do responsável" error={errors.whatsappResponsavel}>
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            value={form.whatsappResponsavel}
            onChange={handleChange('whatsappResponsavel')}
            className={inputStyles}
          />
        </FormField>
        <FormField label="Email do responsável" error={errors.emailResponsavel}>
          <input
            type="email"
            value={form.emailResponsavel}
            onChange={handleChange('emailResponsavel')}
            className={inputStyles}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Área da Mentoria">
          <input
            type="text"
            value={form.area}
            onChange={handleChange('area')}
            className={inputStyles}
          />
        </FormField>
        <FormField label="Mentor">
          <input
            type="text"
            value={form.mentor}
            onChange={handleChange('mentor')}
            className={inputStyles}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Preferência de horário">
          <select
            value={form.preferenciaHorario}
            onChange={handleChange('preferenciaHorario')}
            className={inputStyles}
          >
            <option value="">—</option>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Noite">Noite</option>
          </select>
        </FormField>
        <FormField label="Urgência">
          <select
            value={form.urgencia}
            onChange={handleChange('urgencia')}
            className={inputStyles}
          >
            <option value="">—</option>
            <option value="Alta">Alta prioridade</option>
            <option value="Média">Média prioridade</option>
            <option value="Baixa">Baixa prioridade</option>
          </select>
        </FormField>
        <FormField label="Status">
          <select
            value={form.status}
            onChange={handleChange('status')}
            className={inputStyles}
          >
            <option value="Agendada">Agendada</option>
            <option value="Concluída">Concluída</option>
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Data e hora da Mentoria">
          <input
            type="datetime-local"
            value={form.dataMentoria}
            onChange={handleChange('dataMentoria')}
            className={inputStyles}
          />
        </FormField>
        <FormField label="Relatório Recebido">
          <input
            type="text"
            value={form.relatorioRecebido}
            onChange={handleChange('relatorioRecebido')}
            className={inputStyles}
          />
        </FormField>
      </div>

      <FormField label="Observações">
        <textarea
          rows={3}
          value={form.observacoes}
          onChange={handleChange('observacoes')}
          className={inputStyles}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-md border border-secondary-light px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-60"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
