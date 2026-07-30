import { supabase } from '../lib/supabaseClient'

export async function fetchStartups() {
  const { data, error } = await supabase
    .from('startups')
    .select('*')
    .order('nome')

  if (error) throw error

  return data.map((row) => ({
    nome: row.nome,
    srl: row.srl,
    modalidade: row.modalidade,
    categoria: row.categoria,
    setor: row.setor,
    ceo: row.ceo,
    email: row.email,
    whatsapp: row.whatsapp,
    diagnostico: row.diagnostico,
    planoAcao: row.plano_acao,
  }))
}

export function countStartupsByCategoria(list) {
  const counts = {}
  for (const startup of list) {
    if (startup.categoria === '—') continue
    counts[startup.categoria] = (counts[startup.categoria] ?? 0) + 1
  }
  return Object.entries(counts).map(([categoria, quantidade]) => ({
    categoria,
    quantidade,
  }))
}
