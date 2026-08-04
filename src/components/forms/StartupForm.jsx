import { useState } from 'react'
import FormField, { inputStyles } from '../FormField'
import { isRequired, isValidEmail, isValidPhone } from '../../lib/validators'
import { uploadContrato } from '../../data/startups'

const emptyForm = {
  nome: '',
  srl: '—',
  modalidade: '—',
  categoria: '',
  setor: '',
  ceo: '',
  email: '',
  whatsapp: '',
  diagnostico: '—',
  planoAcao: '—',
  agendamentoMentoria: '—',
  contratoUrl: '',
}

export default function StartupForm({ initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValues ?? emptyForm)
  const [contratoFile, setContratoFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }
  }

  function handleContratoChange(event) {
    const file = event.target.files?.[0] ?? null
    if (file && file.type !== 'application/pdf') {
      setErrors((prev) => ({ ...prev, contrato: 'O contrato precisa ser um arquivo PDF.' }))
      setContratoFile(null)
      return
    }
    setErrors((prev) => ({ ...prev, contrato: undefined }))
    setContratoFile(file)
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
      let contratoUrl = form.contratoUrl
      if (contratoFile) {
        contratoUrl = await uploadContrato(contratoFile)
      }
      await onSubmit({ ...form, contratoUrl })
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="SRL">
          <select
            value={form.srl}
            onChange={handleChange('srl')}
            className={inputStyles}
          >
            <option value="—">—</option>
            <option value="Ideação">Ideação</option>
            <option value="Validação">Validação</option>
            <option value="Operação">Operação</option>
            <option value="Escala">Escala</option>
          </select>
        </FormField>
        <FormField label="Modalidade">
          <select
            value={form.modalidade}
            onChange={handleChange('modalidade')}
            className={inputStyles}
          >
            <option value="—">—</option>
            <option value="Presencial">Presencial</option>
            <option value="Online">Online</option>
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Categoria">
          <input
            type="text"
            value={form.categoria}
            onChange={handleChange('categoria')}
            className={inputStyles}
          />
        </FormField>
        <FormField label="Setor">
          <input
            type="text"
            value={form.setor}
            onChange={handleChange('setor')}
            className={inputStyles}
          />
        </FormField>
      </div>

      <FormField label="CEO">
        <input
          type="text"
          value={form.ceo}
          onChange={handleChange('ceo')}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Diagnóstico">
          <select
            value={form.diagnostico}
            onChange={handleChange('diagnostico')}
            className={inputStyles}
          >
            <option value="—">—</option>
            <option value="Feita">Feita</option>
            <option value="PDF entregue">PDF entregue</option>
          </select>
        </FormField>
        <FormField label="Plano de Ação">
          <select
            value={form.planoAcao}
            onChange={handleChange('planoAcao')}
            className={inputStyles}
          >
            <option value="—">—</option>
            <option value="Feita">Feita</option>
            <option value="PDF entregue">PDF entregue</option>
          </select>
        </FormField>
      </div>

      <FormField label="Agendamento de Mentoria">
        <select
          value={form.agendamentoMentoria}
          onChange={handleChange('agendamentoMentoria')}
          className={inputStyles}
        >
          <option value="—">—</option>
          <option value="Agendada">Agendada</option>
          <option value="PDF entregue">PDF entregue</option>
          <option value="Feita">Feita</option>
        </select>
      </FormField>

      <FormField label="Contrato (PDF)" error={errors.contrato}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleContratoChange}
          className={inputStyles}
        />
        {form.contratoUrl && !contratoFile && (
          <p className="mt-1 text-xs text-neutral-500">
            Contrato atual:{' '}
            <a
              href={form.contratoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-accent-blue underline"
            >
              abrir PDF
            </a>{' '}
            (escolha um novo arquivo acima para substituir)
          </p>
        )}
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
