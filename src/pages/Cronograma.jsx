import { useState } from 'react'
import {
  fetchCronograma,
  createEtapaCronograma,
  updateEtapaCronograma,
  deleteEtapaCronograma,
} from '../data/cronograma'
import { useSupabaseData } from '../hooks/useSupabaseData'
import DataStatus from '../components/DataStatus'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import CronogramaForm from '../components/forms/CronogramaForm'

export default function Cronograma() {
  const { data, error, loading, refetch } = useSupabaseData(fetchCronograma)
  const cronograma = data ?? []

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
      await updateEtapaCronograma(editingItem.id, values)
    } else {
      await createEtapaCronograma(values)
    }
    closeForm()
    await refetch()
  }

  async function confirmDelete() {
    await deleteEtapaCronograma(deletingItem.id)
    setDeletingItem(null)
    await refetch()
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Cronograma</h1>
          <p className="mt-2 text-neutral-600">
            Etapas do programa de incubação ao longo do ano.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="w-fit shrink-0 rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-blue/90"
        >
          Adicionar Etapa
        </button>
      </div>

      <DataStatus loading={loading} error={error} />

      {!loading && !error && (
        <div className="mt-8 space-y-4">
          {cronograma.map((etapa) => (
            <div
              key={etapa.id}
              className="rounded-xl border border-secondary-light bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-secondary-light">
                    {etapa.mes}
                  </span>
                  <span className="rounded-full bg-accent-blue/10 px-3 py-1 text-xs font-medium text-accent-blue">
                    {etapa.tipoAtividade}
                  </span>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {etapa.etapa}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditForm(etapa)}
                    className="rounded-md px-2 py-1 text-xs font-medium text-accent-blue hover:bg-accent-blue/10"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem(etapa)}
                    className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-700">
                <span className="font-medium text-primary">
                  Objetivo principal:{' '}
                </span>
                {etapa.objetivo}
              </p>
              <p className="mt-1 text-sm text-neutral-700">
                <span className="font-medium text-primary">
                  Entregáveis esperados:{' '}
                </span>
                {etapa.entregaveis}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editingItem ? 'Editar Etapa' : 'Adicionar Etapa'}
      >
        <CronogramaForm
          initialValues={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingItem)}
        title="Excluir etapa"
        message={`Tem certeza que deseja excluir "${deletingItem?.etapa}"? Essa ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </section>
  )
}
