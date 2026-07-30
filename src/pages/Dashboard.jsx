import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchStartups, countStartupsByCategoria } from '../data/startups'
import { fetchMentores } from '../data/mentores'
import {
  fetchMentorias,
  countMentoriasByArea,
  countMentoriasByStartup,
  countMentoriasPorMes,
  countMentoriasByMentor,
} from '../data/mentorias'
import DataStatus from '../components/DataStatus'

export default function Dashboard() {
  const [startups, setStartups] = useState(null)
  const [mentores, setMentores] = useState(null)
  const [mentorias, setMentorias] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    Promise.all([fetchStartups(), fetchMentores(), fetchMentorias()])
      .then(([startupsData, mentoresData, mentoriasData]) => {
        if (!isMounted) return
        setStartups(startupsData)
        setMentores(mentoresData)
        setMentorias(mentoriasData)
      })
      .catch((err) => {
        if (isMounted) setError(err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section>
      <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
      <p className="mt-2 text-neutral-600">
        Visão geral do Aquário de Ideias, a incubadora de empresas da UNESP.
      </p>

      <DataStatus loading={loading} error={error} />

      {!loading && !error && (
        <DashboardContent
          startups={startups}
          mentores={mentores}
          mentorias={mentorias}
        />
      )}
    </section>
  )
}

function DashboardContent({ startups, mentores, mentorias }) {
  const startupsByCategoria = countStartupsByCategoria(startups)
  const mentoriasByArea = countMentoriasByArea(mentorias)
  const mentoriasByStartup = countMentoriasByStartup(mentorias)
  const mentoriasPorMes = countMentoriasPorMes(mentorias)
  const mentoresRanking = countMentoriasByMentor(mentorias)
  const maxMentoriasPorMentor = Math.max(
    ...mentoresRanking.map((item) => item.quantidade),
    1,
  )

  const stats = [
    { label: 'Startups incubadas', value: startups.length },
    { label: 'Mentores ativos', value: mentores.length },
    {
      label: 'Mentorias agendadas',
      value: mentorias.filter((m) => m.status === 'Agendada').length,
    },
    {
      label: 'Mentorias concluídas',
      value: mentorias.filter((m) => m.status === 'Concluída').length,
    },
  ]

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-secondary-light bg-white p-6 shadow-sm"
          >
            <p className="text-3xl font-bold text-accent-blue">{stat.value}</p>
            <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-secondary-light bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">
            Startups por categoria
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={startupsByCategoria}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4f3ea" />
                <XAxis
                  dataKey="categoria"
                  tick={{ fontSize: 12, fill: '#525252' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#525252' }}
                />
                <Tooltip
                  cursor={{ fill: '#e4f3ea' }}
                  contentStyle={{ borderRadius: 8, borderColor: '#e4f3ea' }}
                />
                <Bar
                  dataKey="quantidade"
                  name="Startups"
                  fill="#14532d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-secondary-light bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">
            Mentorias por área
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mentoriasByArea}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4f3ea" />
                <XAxis
                  dataKey="area"
                  tick={{ fontSize: 11, fill: '#525252' }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#525252' }}
                />
                <Tooltip
                  cursor={{ fill: '#e4f3ea' }}
                  contentStyle={{ borderRadius: 8, borderColor: '#e4f3ea' }}
                />
                <Bar
                  dataKey="quantidade"
                  name="Mentorias"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-secondary-light bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">
            Mentorias por startup
          </h2>
          <div className="mt-4 h-72 overflow-x-auto">
            <div className="h-full" style={{ minWidth: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mentoriasByStartup}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e4f3ea"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#525252' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="startup"
                    width={130}
                    tick={{ fontSize: 10, fill: '#525252' }}
                  />
                  <Tooltip
                    cursor={{ fill: '#e4f3ea' }}
                    contentStyle={{ borderRadius: 8, borderColor: '#e4f3ea' }}
                  />
                  <Bar
                    dataKey="quantidade"
                    name="Mentorias"
                    fill="#14532d"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-secondary-light bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">
            Mentorias realizadas no mês
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mentoriasPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4f3ea" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#525252' }} />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#525252' }}
                />
                <Tooltip
                  cursor={{ fill: '#e4f3ea' }}
                  contentStyle={{ borderRadius: 8, borderColor: '#e4f3ea' }}
                />
                <Bar
                  dataKey="quantidade"
                  name="Mentorias"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-secondary-light bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-primary">
          Mentores mais acionados
        </h2>
        <ul className="mt-4 space-y-3">
          {mentoresRanking.map((item, index) => (
            <li key={item.mentor}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-neutral-800">
                  {index + 1}. {item.mentor}
                </span>
                <span className="shrink-0 text-neutral-500">
                  {item.quantidade}
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-secondary-light">
                <div
                  className="h-2 rounded-full bg-accent-blue"
                  style={{
                    width: `${(item.quantidade / maxMentoriasPorMentor) * 100}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-xl bg-secondary-light p-6">
        <h2 className="text-xl font-semibold text-primary">
          Sobre a incubadora
        </h2>
        <p className="mt-2 text-neutral-700">
          O Aquário de Ideias apoia estudantes e pesquisadores da UNESP a
          transformar projetos em startups, oferecendo mentorias,
          infraestrutura e conexão com o ecossistema de inovação.
        </p>
      </div>
    </>
  )
}
