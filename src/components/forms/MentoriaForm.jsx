import { useState } from 'react'
import FormField, { inputStyles } from '../FormField'
import { isRequired } from '../../lib/validators'

const emptyForm = {
  startup: '',
  responsavelStartup: '',
  area: '',
  mentor: '',
  dataSolicitacao: '',
  status: 'Agendada',
  dataAgendamento: '',
  dataMentoria: '',
  relatorioRecebido: '',
  pagamentoMentor: '',
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

      <FormField label="Startup" required error={errors.startup}>
        <input
          type="text"
          value={form.startup}
          onChange={handleChange('startup')}
          className={inputStyles}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Responsável da Startup">
          <input
            type="text"
            value={form.responsavelStartup}
            onChange={handleChange('responsavelStartup')}
            className={inputStyles}
          />
        </FormField>
        <FormField label="Área da Mentoria">
          <input
            type="text"
            value={form.area}
            onChange={handleChange('area')}
            className={inputStyles}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Mentor">
          <input
            type="text"
            value={form.mentor}
            onChange={handleChange('mentor')}
            className={inputStyles}
          />
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Data da Solicitação">
          <input
            type="text"
            placeholder="dd/mm"
            value={form.dataSolicitacao}
            onChange={handleChange('dataSolicitacao')}
            className={inputStyles}
          />
        </FormField>
        <FormField label="Data do Agendamento">
          <input
            type="text"
            placeholder="dd/mm"
            value={form.dataAgendamento}
            onChange={handleChange('dataAgendamento')}
            className={inputStyles}
          />
        </FormField>
        <FormField label="Data da Mentoria">
          <input
            type="text"
            placeholder="dd/mm"
            value={form.dataMentoria}
            onChange={handleChange('dataMentoria')}
            className={inputStyles}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Relatório Recebido">
          <input
            type="text"
            value={form.relatorioRecebido}
            onChange={handleChange('relatorioRecebido')}
            className={inputStyles}
          />
        </FormField>
        <FormField label="Pagamento do Mentor">
          <input
            type="text"
            value={form.pagamentoMentor}
            onChange={handleChange('pagamentoMentor')}
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
