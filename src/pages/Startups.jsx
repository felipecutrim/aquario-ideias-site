import { useMemo, useState } from 'react'
import { fetchStartups } from '../data/startups'
import { useSupabaseData } from '../hooks/useSupabaseData'
import DataStatus from '../components/DataStatus'

const badgeStyles = {
  Feita: 'bg-secondary-light text-primary',
  'PDF entregue': 'bg-accent-blue/10 text-accent-blue',
  '—': 'bg-neutral-100 text-neutral-400',
}

function uniqueValues(startups, key) {
  return Array.from(
    new Set(
      startups.map((startup) => startup[key]).filter((value) => value !== '—'),
    ),
  ).sort()
}

function Badge({ value }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[value]}`}
    >
      {value}
    </span>
  )
}

function display(value) {
  return value || '—'
}

export default function Startups() {
  const { data, error, loading } = useSupabaseData(fetchStartups)
  const startups = data ?? []

  const [search, setSearch] = useState('')
  const [srl, setSrl] = useState('')
  const [categoria, setCategoria] = useState('')
  const [setor, setSetor] = useState('')

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

  return (
    <section>
      <h1 className="text-3xl font-bold text-primary">Startups</h1>
      <p className="mt-2 text-neutral-600">
        Empresas incubadas atualmente no Aquário de Ideias.
      </p>

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
                  <th className="px-4 py-3 font-semibold">Nome</th>
                  <th className="px-4 py-3 font-semibold">SRL</th>
                  <th className="px-4 py-3 font-semibold">Modalidade</th>
                  <th className="px-4 py-3 font-semibold">Categoria</th>
                  <th className="px-4 py-3 font-semibold">Setor</th>
                  <th className="px-4 py-3 font-semibold">CEO</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">WhatsApp</th>
                  <th className="px-4 py-3 font-semibold">Diagnóstico</th>
                  <th className="px-4 py-3 font-semibold">Plano de Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-light">
                {filtered.map((startup) => (
                  <tr key={startup.nome}>
                    <td className="px-4 py-3 font-medium text-neutral-900">
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
                    <td className="px-4 py-3 text-neutral-600">
                      {startup.ceo}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {filtered.map((startup) => (
              <div
                key={startup.nome}
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
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
