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
    agendamentoMentoria: row.agendamento_mentoria,
    contratoUrl: row.contrato_url,
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
    agendamento_mentoria: startup.agendamentoMentoria,
    contrato_url: startup.contratoUrl,
  }
}

const CONTRATOS_BUCKET = 'contratos'

// O Supabase Storage rejeita chaves com espaços, acentos ou outros
// caracteres especiais ("Invalid key"). O nome original do arquivo
// não é usado como chave — só para exibição, se algum dia for exibido.
function sanitizeFileName(fileName) {
  const diacriticos = new RegExp('[̀-ͯ]', 'g')
  const semAcentos = fileName.normalize('NFD').replace(diacriticos, '')
  return semAcentos.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '')
}

export async function uploadContrato(file) {
  const path = `${Date.now()}-${sanitizeFileName(file.name)}`
  const { error: uploadError } = await supabase.storage
    .from(CONTRATOS_BUCKET)
    .upload(path, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(CONTRATOS_BUCKET).getPublicUrl(path)
  return data.publicUrl
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

const SRL_STAGES = ['Ideação', 'Validação', 'Operação', 'Escala']

export function countStartupsBySrl(list) {
  const counts = Object.fromEntries(SRL_STAGES.map((srl) => [srl, 0]))
  for (const startup of list) {
    if (startup.srl in counts) {
      counts[startup.srl] += 1
    }
  }
  return SRL_STAGES.map((srl) => ({ srl, quantidade: counts[srl] }))
}
