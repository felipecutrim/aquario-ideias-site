import { cronograma } from '../data/cronograma'

export default function Cronograma() {
  return (
    <section>
      <h1 className="text-3xl font-bold text-primary">Cronograma</h1>
      <p className="mt-2 text-neutral-600">
        Etapas do programa de incubação ao longo do ano.
      </p>

      <div className="mt-8 space-y-4">
        {cronograma.map((etapa, index) => (
          <div
            key={index}
            className="rounded-xl border border-secondary-light bg-white p-6 shadow-sm"
          >
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
    </section>
  )
}
