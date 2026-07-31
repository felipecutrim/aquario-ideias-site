import { useState } from 'react'
import FormField, { inputStyles } from '../FormField'
import { isRequired } from '../../lib/validators'

const emptyForm = {
  trilha: '',
  tema: '',
  palestrante: '',
  data: '',
  horario: '',
}

export default function CapacitacaoForm({ initialValues, onSubmit, onCancel }) {
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
    if (!isRequired(form.tema)) {
      nextErrors.tema = 'Tema é obrigatório.'
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

      <FormField label="SRL/Trilha">
        <input
          type="text"
          placeholder="Ex.: Painel Deep Tech, Online..."
          value={form.trilha}
          onChange={handleChange('trilha')}
          className={inputStyles}
        />
      </FormField>

      <FormField label="Tema" required error={errors.tema}>
        <input
          type="text"
          value={form.tema}
          onChange={handleChange('tema')}
          className={inputStyles}
        />
      </FormField>

      <FormField label="Palestrante">
        <input
          type="text"
          value={form.palestrante}
          onChange={handleChange('palestrante')}
          className={inputStyles}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Data">
          <input
            type="text"
            placeholder="Ex.: 02/05"
            value={form.data}
            onChange={handleChange('data')}
            className={inputStyles}
          />
        </FormField>
        <FormField label="Horário">
          <input
            type="text"
            placeholder="Ex.: 09:30"
            value={form.horario}
            onChange={handleChange('horario')}
            className={inputStyles}
          />
        </FormField>
      </div>

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
