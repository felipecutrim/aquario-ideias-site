import { useState } from 'react'
import FormField, { inputStyles } from '../FormField'
import { isRequired } from '../../lib/validators'

const emptyForm = {
  mes: '',
  tipoAtividade: '',
  etapa: '',
  objetivo: '',
  entregaveis: '',
}

export default function CronogramaForm({ initialValues, onSubmit, onCancel }) {
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
    if (!isRequired(form.mes)) {
      nextErrors.mes = 'Mês é obrigatório.'
    }
    if (!isRequired(form.etapa)) {
      nextErrors.etapa = 'Reunião/Etapa é obrigatória.'
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Mês" required error={errors.mes}>
          <input
            type="text"
            value={form.mes}
            onChange={handleChange('mes')}
            className={inputStyles}
          />
        </FormField>
        <FormField label="Tipo de Atividade">
          <input
            type="text"
            value={form.tipoAtividade}
            onChange={handleChange('tipoAtividade')}
            className={inputStyles}
          />
        </FormField>
      </div>

      <FormField label="Reunião/Etapa" required error={errors.etapa}>
        <input
          type="text"
          value={form.etapa}
          onChange={handleChange('etapa')}
          className={inputStyles}
        />
      </FormField>

      <FormField label="Objetivo Principal">
        <textarea
          rows={3}
          value={form.objetivo}
          onChange={handleChange('objetivo')}
          className={inputStyles}
        />
      </FormField>

      <FormField label="Entregáveis Esperados">
        <textarea
          rows={3}
          value={form.entregaveis}
          onChange={handleChange('entregaveis')}
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
