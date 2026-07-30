import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import RequireAuth from './components/RequireAuth'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Startups from './pages/Startups'
import Mentores from './pages/Mentores'
import Mentorias from './pages/Mentorias'
import SolicitarMentoria from './pages/SolicitarMentoria'
import Capacitacoes from './pages/Capacitacoes'
import Cronograma from './pages/Cronograma'
import Configuracoes from './pages/Configuracoes'

function AppLayout() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-neutral-50">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? 'mx-auto max-w-6xl px-6 py-8' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/startups"
            element={
              <RequireAuth>
                <Startups />
              </RequireAuth>
            }
          />
          <Route
            path="/mentores"
            element={
              <RequireAuth>
                <Mentores />
              </RequireAuth>
            }
          />
          <Route
            path="/mentorias"
            element={
              <RequireAuth>
                <Mentorias />
              </RequireAuth>
            }
          />
          <Route
            path="/mentorias/solicitar"
            element={
              <RequireAuth>
                <SolicitarMentoria />
              </RequireAuth>
            }
          />
          <Route
            path="/capacitacoes"
            element={
              <RequireAuth>
                <Capacitacoes />
              </RequireAuth>
            }
          />
          <Route
            path="/cronograma"
            element={
              <RequireAuth>
                <Cronograma />
              </RequireAuth>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <RequireAuth>
                <Configuracoes />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  )
}
