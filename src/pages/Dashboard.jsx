import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  fetchStartups,
  countStartupsByCategoria,
  countStartupsBySrl,
} from '../data/startups'
import { fetchMentores } from '../data/mentores'
import {
  fetchMentorias,
  countMentoriasByArea,
  countMentoriasByStartup,
  countMentoriasPorMes,
} from '../data/mentorias'
import DataStatus from '../components/DataStatus'

const DONUT_COLORS = ['#14532d', '#2563eb', '#22c55e', '#60a5fa', '#86efac', '#1d4ed8']

const chartCardClassName =
  'rounded-xl border border-secondary-light bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-lg'

const labelStyle = { fill: '#14532d', fontSize: 12, fontWeight: 600 }

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
  const startupsBySrl = countStartupsBySrl(startups)
  const mentoriasByArea = countMentoriasByArea(mentorias)
  const mentoriasByStartup = countMentoriasByStartup(mentorias)
  const mentoriasPorMes = countMentoriasPorMes(mentorias)

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

      <div className={`mt-8 ${chartCardClassName}`}>
        <h2 className="text-lg font-semibold text-primary">
          Indicadores das Startups
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Quantidade de startups por etapa (SRL)
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {startupsBySrl.map((item) => (
            <div
              key={item.srl}
              className="rounded-lg bg-secondary-light px-4 py-5 text-center"
            >
              <p className="text-2xl font-bold text-primary">
                {item.quantidade}
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-600">
                {item.srl}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={chartCardClassName}>
          <h2 className="text-lg font-semibold text-primary">
            Startups por categoria
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={startupsByCategoria}
                  dataKey="quantidade"
                  nameKey="categoria"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={2}
                >
                  {startupsByCategoria.map((entry, index) => (
                    <Cell
                      key={entry.categoria}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, borderColor: '#e4f3ea' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={chartCardClassName}>
          <h2 className="text-lg font-semibold text-primary">
            Mentorias por área
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mentoriasByArea} margin={{ top: 20 }}>
                <defs>
                  <linearGradient id="gradientAreaBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1d4ed8" />
                    <stop offset="100%" stopColor="#93c5fd" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4f3ea" opacity={0.5} />
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
                  fill="url(#gradientAreaBlue)"
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList dataKey="quantidade" position="top" style={labelStyle} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={chartCardClassName}>
          <h2 className="text-lg font-semibold text-primary">
            Mentorias por startup
          </h2>
          <div className="mt-4 h-72 overflow-x-auto">
            <div className="h-full" style={{ minWidth: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mentoriasByStartup}
                  layout="vertical"
                  margin={{ left: 8, right: 24 }}
                >
                  <defs>
                    <linearGradient id="gradientStartupGreen" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#14532d" />
                      <stop offset="100%" stopColor="#86efac" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e4f3ea"
                    opacity={0.5}
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
                    fill="url(#gradientStartupGreen)"
                    radius={[0, 4, 4, 0]}
                  >
                    <LabelList
                      dataKey="quantidade"
                      position="right"
                      style={labelStyle}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className={chartCardClassName}>
          <h2 className="text-lg font-semibold text-primary">
            Mentorias realizadas no mês
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mentoriasPorMes} margin={{ top: 20 }}>
                <defs>
                  <linearGradient id="gradientMesBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1d4ed8" />
                    <stop offset="100%" stopColor="#93c5fd" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4f3ea" opacity={0.5} />
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
                  fill="url(#gradientMesBlue)"
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList dataKey="quantidade" position="top" style={labelStyle} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
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
