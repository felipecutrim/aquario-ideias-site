import { useMemo, useState } from 'react'
import {
  fetchStartups,
  createStartup,
  updateStartup,
  deleteStartup,
} from '../data/startups'
import { useSupabaseData } from '../hooks/useSupabaseData'
import DataStatus from '../components/DataStatus'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import StartupForm from '../components/forms/StartupForm'

const badgeStyles = {
  Feita: 'bg-secondary-light text-primary',
  'PDF entregue': 'bg-accent-blue/10 text-accent-blue',
  Agendada: 'bg-accent-blue/10 text-accent-blue',
  '—': 'bg-neutral-100 text-neutral-400',
}

function uniqueValues(startups, key) {
  return Array.from(
    new Set(
      startups.map((startup) => startup[key]).filter((value) => value !== '—'),
    ),
  ).sort()
}

function display(value) {
  return value || '—'
}

function Badge({ value }) {
  const label = display(value)
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[label] ?? 'bg-neutral-100 text-neutral-400'}`}
    >
      {label}
    </span>
  )
}

export default function Startups() {
  const { data, error, loading, refetch } = useSupabaseData(fetchStartups)
  const startups = data ?? []

  const [search, setSearch] = useState('')
  const [srl, setSrl] = useState('')
  const [categoria, setCategoria] = useState('')
  const [setor, setSetor] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingStartup, setEditingStartup] = useState(null)
  const [deletingStartup, setDeletingStartup] = useState(null)

  const srlOptions = useMemo(() => uniqueValues(startups, 'srl'), [startups])
  const categoriaOptions = useMemo(
    () => uniqueValues(startups, 'categoria'),
    [startups],
  )
  const setorOptions = useMemo(() => uniqueValues(startups, 'setor'), [startups])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return startups.filter((startup) => {
      const matchesSearch =
        !term ||
        startup.nome.toLowerCase().includes(term) ||
        startup.ceo.toLowerCase().includes(term)
      const matchesSrl = !srl || startup.srl === srl
      const matchesCategoria = !categoria || startup.categoria === categoria
      const matchesSetor = !setor || startup.setor === setor
      return matchesSearch && matchesSrl && matchesCategoria && matchesSetor
    })
  }, [startups, search, srl, categoria, setor])

  function openAddForm() {
    setEditingStartup(null)
    setFormOpen(true)
  }

  function openEditForm(startup) {
    setEditingStartup(startup)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingStartup(null)
  }

  async function handleFormSubmit(values) {
    if (editingStartup) {
      await updateStartup(editingStartup.id, values)
    } else {
      await createStartup(values)
    }
    closeForm()
    await refetch()
  }

  async function confirmDelete() {
    await deleteStartup(deletingStartup.id)
    setDeletingStartup(null)
    await refetch()
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Startups</h1>
          <p className="mt-2 text-neutral-600">
            Empresas incubadas atualmente no Aquário de Ideias.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="w-fit shrink-0 rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-blue/90"
        >
          Adicionar Startup
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome ou CEO..."
          className="min-w-56 flex-1 rounded-md border border-secondary-light bg-white px-4 py-2 text-sm text-neutral-700 focus:border-accent-blue focus:outline-none"
        />
        <select
          value={srl}
          onChange={(event) => setSrl(event.target.value)}
          className="rounded-md border border-secondary-light bg-white px-3 py-2 text-sm text-neutral-700 focus:border-accent-blue focus:outline-none"
        >
          <option value="">Todos os SRL</option>
          {srlOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
          className="rounded-md border border-secondary-light bg-white px-3 py-2 text-sm text-neutral-700 focus:border-accent-blue focus:outline-none"
        >
          <option value="">Todas as categorias</option>
          {categoriaOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={setor}
          onChange={(event) => setSetor(event.target.value)}
          className="rounded-md border border-secondary-light bg-white px-3 py-2 text-sm text-neutral-700 focus:border-accent-blue focus:outline-none"
        >
          <option value="">Todos os setores</option>
          {setorOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <DataStatus loading={loading} error={error} />

      {!loading && !error && filtered.length === 0 && (
        <p className="mt-6 rounded-xl border border-secondary-light bg-white px-4 py-6 text-center text-neutral-400">
          Nenhuma startup encontrada para os filtros selecionados.
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="mt-6 hidden overflow-x-auto rounded-xl border border-secondary-light bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary-light text-primary">
                <tr>
                  <th className="min-w-[160px] px-4 py-3 font-semibold">
                    Nome
                  </th>
                  <th className="min-w-[90px] px-4 py-3 font-semibold">
                    SRL
                  </th>
                  <th className="min-w-[100px] px-4 py-3 font-semibold">
                    Modalidade
                  </th>
                  <th className="min-w-[90px] px-4 py-3 font-semibold">
                    Categoria
                  </th>
                  <th className="min-w-[90px] px-4 py-3 font-semibold">
                    Setor
                  </th>
                  <th className="min-w-[160px] px-4 py-3 font-semibold">
                    CEO
                  </th>
                  <th className="min-w-[180px] px-4 py-3 font-semibold">
                    Email
                  </th>
                  <th className="min-w-[120px] px-4 py-3 font-semibold">
                    WhatsApp
                  </th>
                  <th className="min-w-[110px] px-4 py-3 font-semibold">
                    Diagnóstico
                  </th>
                  <th className="min-w-[110px] px-4 py-3 font-semibold">
                    Plano de Ação
                  </th>
                  <th className="min-w-[130px] px-4 py-3 font-semibold">
                    Agendamento de Mentoria
                  </th>
                  <th className="min-w-[90px] px-4 py-3 font-semibold">
                    Contrato
                  </th>
                  <th className="min-w-[90px] px-4 py-3 font-semibold">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-light">
                {filtered.map((startup) => (
                  <tr key={startup.id}>
                    <td className="break-words px-4 py-3 font-medium text-neutral-900">
                      {startup.nome}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {startup.srl}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {startup.modalidade}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {startup.categoria}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {startup.setor}
                    </td>
                    <td className="break-words px-4 py-3 text-neutral-600">
                      {startup.ceo}
                    </td>
                    <td className="break-words px-4 py-3 text-neutral-600">
                      {display(startup.email)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {display(startup.whatsapp)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge value={startup.diagnostico} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge value={startup.planoAcao} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge value={startup.agendamentoMentoria} />
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {startup.contratoUrl ? (
                        <a
                          href={startup.contratoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-accent-blue hover:underline"
                        >
                          Ver PDF
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(startup)}
                          className="rounded-md px-2 py-1 text-xs font-medium text-accent-blue hover:bg-accent-blue/10"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingStartup(startup)}
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

          <div className="mt-6 space-y-3 md:hidden">
            {filtered.map((startup) => (
              <div
                key={startup.id}
                className="space-y-2 rounded-xl border border-secondary-light bg-white p-4 shadow-sm"
              >
                <p className="font-semibold text-neutral-900">
                  {startup.nome}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">SRL: </span>
                  {startup.srl}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Modalidade:{' '}
                  </span>
                  {startup.modalidade}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Categoria:{' '}
                  </span>
                  {startup.categoria}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Setor:{' '}
                  </span>
                  {startup.setor}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">CEO: </span>
                  {startup.ceo}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Email:{' '}
                  </span>
                  {display(startup.email)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    WhatsApp:{' '}
                  </span>
                  {display(startup.whatsapp)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Diagnóstico:{' '}
                  </span>
                  <Badge value={startup.diagnostico} />
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Plano de Ação:{' '}
                  </span>
                  <Badge value={startup.planoAcao} />
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Agendamento de Mentoria:{' '}
                  </span>
                  <Badge value={startup.agendamentoMentoria} />
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Contrato:{' '}
                  </span>
                  {startup.contratoUrl ? (
                    <a
                      href={startup.contratoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-accent-blue hover:underline"
                    >
                      Ver PDF
                    </a>
                  ) : (
                    '—'
                  )}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openEditForm(startup)}
                    className="rounded-md border border-secondary-light px-3 py-1.5 text-xs font-medium text-accent-blue hover:bg-accent-blue/10"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingStartup(startup)}
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
        title={editingStartup ? 'Editar Startup' : 'Adicionar Startup'}
      >
        <StartupForm
          initialValues={editingStartup}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingStartup)}
        title="Excluir startup"
        message={`Tem certeza que deseja excluir "${deletingStartup?.nome}"? Essa ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingStartup(null)}
      />
    </section>
  )
}
