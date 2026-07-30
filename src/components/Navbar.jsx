import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/startups', label: 'Startups' },
  { to: '/mentores', label: 'Mentores' },
  { to: '/mentorias', label: 'Mentorias' },
  { to: '/capacitacoes', label: 'Capacitações' },
  { to: '/cronograma', label: 'Cronograma' },
  { to: '/configuracoes', label: 'Configurações' },
]

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="bg-primary shadow-md">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <span className="text-lg font-semibold text-secondary-light">
          Aquário de Ideias
        </span>
        <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent-blue text-white'
                      : 'text-secondary-light hover:bg-primary-dark'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-4 py-2 text-sm font-medium text-secondary-light transition-colors hover:bg-primary-dark"
            >
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
