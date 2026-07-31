import { supabase } from '../lib/supabaseClient'

function mapRowToStartup(row) {
  return {
    id: row.id,
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
  }
}

function mapStartupToRow(startup) {
  return {
    nome: startup.nome,
    srl: startup.srl,
    modalidade: startup.modalidade,
    categoria: startup.categoria,
    setor: startup.setor,
    ceo: startup.ceo,
    email: startup.email,
    whatsapp: startup.whatsapp,
    diagnostico: startup.diagnostico,
    plano_acao: startup.planoAcao,
  }
}

export async function fetchStartups() {
  const { data, error } = await supabase
    .from('startups')
    .select('*')
    .order('nome')

  if (error) throw error

  return data.map(mapRowToStartup)
}

export async function createStartup(startup) {
  const { data, error } = await supabase
    .from('startups')
    .insert([mapStartupToRow(startup)])
    .select()
    .single()

  if (error) throw error
  return mapRowToStartup(data)
}

export async function updateStartup(id, startup) {
  const { data, error } = await supabase
    .from('startups')
    .update(mapStartupToRow(startup))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapRowToStartup(data)
}

export async function deleteStartup(id) {
  const { error } = await supabase.from('startups').delete().eq('id', id)
  if (error) throw error
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
