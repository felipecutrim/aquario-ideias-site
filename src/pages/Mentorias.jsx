import { Link } from 'react-router-dom'
import { fetchMentorias } from '../data/mentorias'
import { useSupabaseData } from '../hooks/useSupabaseData'
import DataStatus from '../components/DataStatus'

const statusStyles = {
  Agendada: 'bg-accent-blue/10 text-accent-blue',
  Concluída: 'bg-secondary-light text-primary',
}

function display(value) {
  return value || '—'
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

export default function Mentorias() {
  const { data, error, loading } = useSupabaseData(fetchMentorias)
  const mentorias = data ?? []

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Mentorias</h1>
          <p className="mt-2 text-neutral-600">
            Sessões de mentoria agendadas e realizadas.
          </p>
        </div>
        <Link
          to="/mentorias/solicitar"
          className="w-fit rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-blue/90"
        >
          Solicitar mentoria
        </Link>
      </div>

      <DataStatus loading={loading} error={error} />

      {!loading && !error && (
        <>
          <div className="mt-8 hidden overflow-x-auto rounded-xl border border-secondary-light bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary-light text-primary">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Startup</th>
                  <th className="px-4 py-3 font-semibold">
                    Responsável da Startup
                  </th>
                  <th className="px-4 py-3 font-semibold">Área da Mentoria</th>
                  <th className="px-4 py-3 font-semibold">Mentor</th>
                  <th className="px-4 py-3 font-semibold">
                    Data da Solicitação
                  </th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">
                    Data do Agendamento
                  </th>
                  <th className="px-4 py-3 font-semibold">Data da Mentoria</th>
                  <th className="px-4 py-3 font-semibold">
                    Relatório Recebido
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Pagamento do Mentor
                  </th>
                  <th className="px-4 py-3 font-semibold">Observações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-light">
                {mentorias.map((sessao) => (
                  <tr key={sessao.id}>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {sessao.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {sessao.startup}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {sessao.responsavelStartup}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {sessao.area}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {sessao.mentor}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {display(sessao.dataSolicitacao)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={sessao.status} />
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {display(sessao.dataAgendamento)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {display(sessao.dataMentoria)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {display(sessao.relatorioRecebido)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {display(sessao.pagamentoMentor)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {display(sessao.observacoes)}
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
                    Data do Agendamento:{' '}
                  </span>
                  {display(sessao.dataAgendamento)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Data da Mentoria:{' '}
                  </span>
                  {display(sessao.dataMentoria)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Relatório Recebido:{' '}
                  </span>
                  {display(sessao.relatorioRecebido)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Pagamento do Mentor:{' '}
                  </span>
                  {display(sessao.pagamentoMentor)}
                </p>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-500">
                    Observações:{' '}
                  </span>
                  {display(sessao.observacoes)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
