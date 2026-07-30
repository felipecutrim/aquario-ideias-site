import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Startups from './pages/Startups'
import Mentores from './pages/Mentores'
import Mentorias from './pages/Mentorias'
import SolicitarMentoria from './pages/SolicitarMentoria'
import Capacitacoes from './pages/Capacitacoes'
import Cronograma from './pages/Cronograma'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/startups" element={<Startups />} />
            <Route path="/mentores" element={<Mentores />} />
            <Route path="/mentorias" element={<Mentorias />} />
            <Route path="/mentorias/solicitar" element={<SolicitarMentoria />} />
            <Route path="/capacitacoes" element={<Capacitacoes />} />
            <Route path="/cronograma" element={<Cronograma />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
