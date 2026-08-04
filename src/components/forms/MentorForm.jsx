import { useState } from 'react'
import FormField, { inputStyles } from '../FormField'
import { isRequired, isValidEmail, isValidPhone } from '../../lib/validators'

const emptyForm = {
  nome: '',
  modalidade: 'Remunerado',
  area: '',
  email: '',
  whatsapp: '',
  chavePix: '',
  miniBiografia: '',
}

export default function MentorForm({ initialValues, onSubmit, onCancel }) {
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
    if (!isRequired(form.nome)) {
      nextErrors.nome = 'Nome é obrigatório.'
    }
    if (!isValidEmail(form.email)) {
      nextErrors.email = 'Informe um e-mail válido (ex.: nome@dominio.com).'
    }
    if (!isValidPhone(form.whatsapp)) {
      nextErrors.whatsapp = 'Informe um WhatsApp válido, com DDD.'
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

      <FormField label="Nome" required error={errors.nome}>
        <input
          type="text"
          value={form.nome}
          onChange={handleChange('nome')}
          className={inputStyles}
        />
      </FormField>

      <FormField label="Modalidade">
        <select
          value={form.modalidade}
          onChange={handleChange('modalidade')}
          className={inputStyles}
        >
          <option value="Remunerado">Remunerado</option>
          <option value="Voluntário">Voluntário</option>
        </select>
      </FormField>

      <FormField label="Áreas de Especialidade">
        <input
          type="text"
          placeholder="Ex.: Marketing e Vendas, Modelo de Negócios"
          value={form.area}
          onChange={handleChange('area')}
          className={inputStyles}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Email" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            className={inputStyles}
          />
        </FormField>
        <FormField label="WhatsApp" error={errors.whatsapp}>
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            value={form.whatsapp}
            onChange={handleChange('whatsapp')}
            className={inputStyles}
          />
        </FormField>
      </div>

      <FormField label="Chave Pix">
        <input
          type="text"
          value={form.chavePix}
          onChange={handleChange('chavePix')}
          className={inputStyles}
        />
      </FormField>

      <FormField label="Mini Biografia">
        <textarea
          rows={4}
          value={form.miniBiografia}
          onChange={handleChange('miniBiografia')}
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
