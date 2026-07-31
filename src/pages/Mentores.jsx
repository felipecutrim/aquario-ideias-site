import { useState } from 'react'
import {
  fetchMentores,
  createMentor,
  updateMentor,
  deleteMentor,
} from '../data/mentores'
import { useSupabaseData } from '../hooks/useSupabaseData'
import DataStatus from '../components/DataStatus'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import MentorForm from '../components/forms/MentorForm'

const modalidadeStyles = {
  Remunerado: 'bg-accent-blue/10 text-accent-blue',
  Voluntário: 'bg-secondary-light text-primary',
}

export default function Mentores() {
  const { data, error, loading, refetch } = useSupabaseData(fetchMentores)
  const mentores = data ?? []

  const [formOpen, setFormOpen] = useState(false)
  const [editingMentor, setEditingMentor] = useState(null)
  const [deletingMentor, setDeletingMentor] = useState(null)

  function openAddForm() {
    setEditingMentor(null)
    setFormOpen(true)
  }

  function openEditForm(mentor) {
    setEditingMentor(mentor)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingMentor(null)
  }

  async function handleFormSubmit(values) {
    if (editingMentor) {
      await updateMentor(editingMentor.id, values)
    } else {
      await createMentor(values)
    }
    closeForm()
    await refetch()
  }

  async function confirmDelete() {
    await deleteMentor(deletingMentor.id)
    setDeletingMentor(null)
    await refetch()
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Mentores</h1>
          <p className="mt-2 text-neutral-600">
            Especialistas que orientam as startups incubadas.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="w-fit shrink-0 rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-blue/90"
        >
          Adicionar Mentor
        </button>
      </div>

      <DataStatus loading={loading} error={error} />

      {!loading && !error && (
        <ul className="mt-8 divide-y divide-secondary-light rounded-xl border border-secondary-light bg-white">
          {mentores.map((mentor) => (
            <li
              key={mentor.id}
              className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-neutral-900">{mentor.nome}</p>
                <p className="text-sm text-neutral-500">{mentor.area}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${modalidadeStyles[mentor.modalidade]}`}
                >
                  {mentor.modalidade}
                </span>
                <button
                  type="button"
                  onClick={() => openEditForm(mentor)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-accent-blue hover:bg-accent-blue/10"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingMentor(mentor)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editingMentor ? 'Editar Mentor' : 'Adicionar Mentor'}
      >
        <MentorForm
          initialValues={editingMentor}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingMentor)}
        title="Excluir mentor"
        message={`Tem certeza que deseja excluir "${deletingMentor?.nome}"? Essa ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingMentor(null)}
      />
    </section>
  )
}
