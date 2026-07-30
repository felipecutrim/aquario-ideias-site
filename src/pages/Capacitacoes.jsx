import { fetchCapacitacoes } from '../data/capacitacoes'
import { useSupabaseData } from '../hooks/useSupabaseData'
import DataStatus from '../components/DataStatus'

const trilhaStyles = {
  'Painel Deep Tech': 'bg-primary/10 text-primary',
  'Painel Comunicação': 'bg-accent-blue/10 text-accent-blue',
  Online: 'bg-secondary-light text-primary',
}

function TrilhaBadge({ trilha }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${trilhaStyles[trilha] ?? 'bg-neutral-100 text-neutral-500'}`}
    >
      {trilha}
    </span>
  )
}

export default function Capacitacoes() {
  const { data, error, loading } = useSupabaseData(fetchCapacitacoes)
  const capacitacoes = data ?? []

  return (
    <section>
      <h1 className="text-3xl font-bold text-primary">Capacitações</h1>
      <p className="mt-2 text-neutral-600">
        Eventos e palestras do programa de capacitação das startups.
      </p>

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
                  <th className="px-6 py-3 font-semibold">Horário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-light">
                {capacitacoes.map((evento, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <TrilhaBadge trilha={evento.trilha} />
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {evento.tema}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {evento.palestrante}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {evento.horario}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 space-y-3 md:hidden">
            {capacitacoes.map((evento, index) => (
              <div
                key={index}
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
                  {evento.palestrante}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Horário:{' '}
                  </span>
                  {evento.horario}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
