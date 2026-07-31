import { useState } from 'react'
import {
  fetchCapacitacoes,
  createCapacitacao,
  updateCapacitacao,
  deleteCapacitacao,
} from '../data/capacitacoes'
import { useSupabaseData } from '../hooks/useSupabaseData'
import DataStatus from '../components/DataStatus'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import CapacitacaoForm from '../components/forms/CapacitacaoForm'

const trilhaStyles = {
  'Painel Deep Tech': 'bg-primary/10 text-primary',
  'Painel Comunicação': 'bg-accent-blue/10 text-accent-blue',
  Online: 'bg-secondary-light text-primary',
}

function display(value) {
  return value || '—'
}

function TrilhaBadge({ trilha }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${trilhaStyles[trilha] ?? 'bg-neutral-100 text-neutral-500'}`}
    >
      {display(trilha)}
    </span>
  )
}

export default function Capacitacoes() {
  const { data, error, loading, refetch } = useSupabaseData(fetchCapacitacoes)
  const capacitacoes = data ?? []

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)

  function openAddForm() {
    setEditingItem(null)
    setFormOpen(true)
  }

  function openEditForm(item) {
    setEditingItem(item)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingItem(null)
  }

  async function handleFormSubmit(values) {
    if (editingItem) {
      await updateCapacitacao(editingItem.id, values)
    } else {
      await createCapacitacao(values)
    }
    closeForm()
    await refetch()
  }

  async function confirmDelete() {
    await deleteCapacitacao(deletingItem.id)
    setDeletingItem(null)
    await refetch()
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Capacitações</h1>
          <p className="mt-2 text-neutral-600">
            Eventos e palestras do programa de capacitação das startups.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="w-fit shrink-0 rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-blue/90"
        >
          Adicionar Capacitação
        </button>
      </div>

      <DataStatus loading={loading} error={error} />

      {!loading && !error && (
        <>
          <div className="mt-8 hidden overflow-x-auto rounded-xl border border-secondary-light bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary-light text-primary">
                <tr>
                  <th className="px-6 py-3 font-semibold">SRL/Trilha</th>
                  <th className="px-6 py-3 font-semibold">Tema</th>
                  <th className="px-6 py-3 font-semibold">Palestrante</th>
                  <th className="px-6 py-3 font-semibold">Data</th>
                  <th className="px-6 py-3 font-semibold">Horário</th>
                  <th className="px-6 py-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-light">
                {capacitacoes.map((evento) => (
                  <tr key={evento.id}>
                    <td className="px-6 py-4">
                      <TrilhaBadge trilha={evento.trilha} />
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {evento.tema}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {display(evento.palestrante)}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {display(evento.data)}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {display(evento.horario)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(evento)}
                          className="rounded-md px-2 py-1 text-xs font-medium text-accent-blue hover:bg-accent-blue/10"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(evento)}
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
            {capacitacoes.map((evento) => (
              <div
                key={evento.id}
                className="space-y-2 rounded-xl border border-secondary-light bg-white p-4 shadow-sm"
              >
                <p className="font-semibold text-neutral-900">{evento.tema}</p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    SRL/Trilha:{' '}
                  </span>
                  <TrilhaBadge trilha={evento.trilha} />
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Palestrante:{' '}
                  </span>
                  {display(evento.palestrante)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">Data: </span>
                  {display(evento.data)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Horário:{' '}
                  </span>
                  {display(evento.horario)}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openEditForm(evento)}
                    className="rounded-md border border-secondary-light px-3 py-1.5 text-xs font-medium text-accent-blue hover:bg-accent-blue/10"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem(evento)}
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
        title={editingItem ? 'Editar Capacitação' : 'Adicionar Capacitação'}
      >
        <CapacitacaoForm
          initialValues={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingItem)}
        title="Excluir capacitação"
        message={`Tem certeza que deseja excluir "${deletingItem?.tema}"? Essa ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </section>
  )
}
