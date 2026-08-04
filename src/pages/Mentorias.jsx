import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchMentorias,
  createMentoria,
  updateMentoria,
  deleteMentoria,
} from '../data/mentorias'
import { useSupabaseData } from '../hooks/useSupabaseData'
import DataStatus from '../components/DataStatus'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import MentoriaForm from '../components/forms/MentoriaForm'

const statusStyles = {
  Agendada: 'bg-accent-blue/10 text-accent-blue',
  Concluída: 'bg-secondary-light text-primary',
}

const urgenciaStyles = {
  Alta: 'bg-red-50 text-red-600',
  Média: 'bg-accent-blue/10 text-accent-blue',
  Baixa: 'bg-secondary-light text-primary',
}

function display(value) {
  return value || '—'
}

function formatDataMentoria(value) {
  if (!value) return '—'
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
  if (!match) return value
  const [, ano, mes, dia, hora, minuto] = match
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}

function UrgenciaBadge({ urgencia }) {
  if (!urgencia) return <span className="text-neutral-400">—</span>
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${urgenciaStyles[urgencia] ?? 'bg-neutral-100 text-neutral-500'}`}
    >
      {urgencia}
    </span>
  )
}

export default function Mentorias() {
  const { data, error, loading, refetch } = useSupabaseData(fetchMentorias)
  const mentorias = data ?? []

  const [formOpen, setFormOpen] = useState(false)
  const [editingMentoria, setEditingMentoria] = useState(null)
  const [deletingMentoria, setDeletingMentoria] = useState(null)

  function openAddForm() {
    setEditingMentoria(null)
    setFormOpen(true)
  }

  function openEditForm(mentoria) {
    setEditingMentoria(mentoria)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingMentoria(null)
  }

  async function handleFormSubmit(values) {
    if (editingMentoria) {
      await updateMentoria(editingMentoria.id, values)
    } else {
      await createMentoria(values)
    }
    closeForm()
    await refetch()
  }

  async function confirmDelete() {
    await deleteMentoria(deletingMentoria.id)
    setDeletingMentoria(null)
    await refetch()
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Mentorias</h1>
          <p className="mt-2 text-neutral-600">
            Sessões de mentoria agendadas e realizadas.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/mentorias/solicitar"
            className="w-fit rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-blue/90"
          >
            Solicitar mentoria
          </Link>
          <button
            type="button"
            onClick={openAddForm}
            className="w-fit rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary-light"
          >
            Adicionar Mentoria
          </button>
        </div>
      </div>

      <DataStatus loading={loading} error={error} />

      {!loading && !error && (
        <>
          <div className="mt-8 hidden overflow-x-auto rounded-xl border border-secondary-light bg-white md:block">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="bg-secondary-light text-primary">
                <tr>
                  <th className="w-[3%] px-4 py-3 font-semibold">ID</th>
                  <th className="w-[9%] px-4 py-3 font-semibold">Startup</th>
                  <th className="w-[8%] px-4 py-3 font-semibold">
                    Responsável da Startup
                  </th>
                  <th className="w-[6%] px-4 py-3 font-semibold">WhatsApp</th>
                  <th className="w-[8%] px-4 py-3 font-semibold">Email</th>
                  <th className="w-[7%] px-4 py-3 font-semibold">
                    Área da Mentoria
                  </th>
                  <th className="w-[7%] px-4 py-3 font-semibold">Mentor</th>
                  <th className="w-[6%] px-4 py-3 font-semibold">
                    Preferência de Horário
                  </th>
                  <th className="w-[5%] px-4 py-3 font-semibold">Urgência</th>
                  <th className="w-[6%] px-4 py-3 font-semibold">
                    Data da Solicitação
                  </th>
                  <th className="w-[5%] px-4 py-3 font-semibold">Status</th>
                  <th className="w-[7%] px-4 py-3 font-semibold">
                    Data da Mentoria
                  </th>
                  <th className="w-[5%] px-4 py-3 font-semibold">
                    Relatório Recebido
                  </th>
                  <th className="w-[11%] px-4 py-3 font-semibold">
                    Observações
                  </th>
                  <th className="w-[7%] px-4 py-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-light">
                {mentorias.map((sessao) => (
                  <tr key={sessao.id}>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {sessao.id}
                    </td>
                    <td className="break-words px-4 py-3 font-medium text-neutral-900">
                      {sessao.startup}
                    </td>
                    <td className="break-words px-4 py-3 text-neutral-600">
                      {sessao.responsavelStartup}
                    </td>
                    <td className="break-words px-4 py-3 text-neutral-600">
                      {display(sessao.whatsappResponsavel)}
                    </td>
                    <td className="break-words px-4 py-3 text-neutral-600">
                      {display(sessao.emailResponsavel)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {sessao.area}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {sessao.mentor}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {display(sessao.preferenciaHorario)}
                    </td>
                    <td className="px-4 py-3">
                      <UrgenciaBadge urgencia={sessao.urgencia} />
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {display(sessao.dataSolicitacao)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={sessao.status} />
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatDataMentoria(sessao.dataMentoria)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {display(sessao.relatorioRecebido)}
                    </td>
                    <td className="break-words px-4 py-3 text-neutral-600">
                      {display(sessao.observacoes)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(sessao)}
                          className="rounded-md px-2 py-1 text-xs font-medium text-accent-blue hover:bg-accent-blue/10"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingMentoria(sessao)}
                          className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 space-y-3 md:hidden">
            {mentorias.map((sessao) => (
              <div
                key={sessao.id}
                className="space-y-2 rounded-xl border border-secondary-light bg-white p-4 shadow-sm"
              >
                <p className="font-semibold text-neutral-900">
                  #{sessao.id} · {sessao.startup}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Responsável da Startup:{' '}
                  </span>
                  {sessao.responsavelStartup}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    WhatsApp:{' '}
                  </span>
                  {display(sessao.whatsappResponsavel)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Email:{' '}
                  </span>
                  {display(sessao.emailResponsavel)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Área da Mentoria:{' '}
                  </span>
                  {sessao.area}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Mentor:{' '}
                  </span>
                  {sessao.mentor}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Preferência de Horário:{' '}
                  </span>
                  {display(sessao.preferenciaHorario)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Urgência:{' '}
                  </span>
                  <UrgenciaBadge urgencia={sessao.urgencia} />
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Data da Solicitação:{' '}
                  </span>
                  {display(sessao.dataSolicitacao)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Status:{' '}
                  </span>
                  <StatusBadge status={sessao.status} />
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Data da Mentoria:{' '}
                  </span>
                  {formatDataMentoria(sessao.dataMentoria)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Relatório Recebido:{' '}
                  </span>
                  {display(sessao.relatorioRecebido)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Observações:{' '}
                  </span>
                  {display(sessao.observacoes)}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openEditForm(sessao)}
                    className="rounded-md border border-secondary-light px-3 py-1.5 text-xs font-medium text-accent-blue hover:bg-accent-blue/10"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingMentoria(sessao)}
                    className="rounded-md border border-secondary-light px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editingMentoria ? 'Editar Mentoria' : 'Adicionar Mentoria'}
      >
        <MentoriaForm
          initialValues={editingMentoria}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingMentoria)}
        title="Excluir mentoria"
        message={`Tem certeza que deseja excluir a mentoria de "${deletingMentoria?.startup}"? Essa ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingMentoria(null)}
      />
    </section>
  )
}
