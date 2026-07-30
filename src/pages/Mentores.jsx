import { mentores } from '../data/mentores'

const modalidadeStyles = {
  Remunerado: 'bg-accent-blue/10 text-accent-blue',
  Voluntário: 'bg-secondary-light text-primary',
}

export default function Mentores() {
  return (
    <section>
      <h1 className="text-3xl font-bold text-primary">Mentores</h1>
      <p className="mt-2 text-neutral-600">
        Especialistas que orientam as startups incubadas.
      </p>

      <ul className="mt-8 divide-y divide-secondary-light rounded-xl border border-secondary-light bg-white">
        {mentores.map((mentor) => (
          <li
            key={mentor.nome}
            className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-neutral-900">{mentor.nome}</p>
              <p className="text-sm text-neutral-500">{mentor.area}</p>
            </div>
            <span
              className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${modalidadeStyles[mentor.modalidade]}`}
            >
              {mentor.modalidade}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
