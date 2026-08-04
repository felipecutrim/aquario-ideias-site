import { supabase } from '../lib/supabaseClient'

function mapRowToMentoria(row) {
  return {
    id: row.id,
    startup: row.startup,
    responsavelStartup: row.responsavel_startup,
    whatsappResponsavel: row.whatsapp_responsavel,
    emailResponsavel: row.email_responsavel,
    area: row.area_mentoria,
    mentor: row.mentor,
    preferenciaHorario: row.preferencia_horario,
    urgencia: row.urgencia,
    dataSolicitacao: row.data_solicitacao,
    status: row.status,
    dataMentoria: row.data_mentoria,
    relatorioRecebido: row.relatorio_recebido,
    observacoes: row.observacoes,
  }
}

function mapMentoriaToRow(mentoria) {
  return {
    startup: mentoria.startup,
    responsavel_startup: mentoria.responsavelStartup,
    whatsapp_responsavel: mentoria.whatsappResponsavel,
    email_responsavel: mentoria.emailResponsavel,
    area_mentoria: mentoria.area,
    mentor: mentoria.mentor,
    preferencia_horario: mentoria.preferenciaHorario,
    urgencia: mentoria.urgencia,
    data_solicitacao: mentoria.dataSolicitacao,
    status: mentoria.status,
    data_mentoria: mentoria.dataMentoria,
    relatorio_recebido: mentoria.relatorioRecebido,
    observacoes: mentoria.observacoes,
  }
}

// "dd/mm/aaaa hh:mm" no fuso local — usado como carimbo de quando o
// registro foi criado (solicitação pública ou cadastro pelo admin).
function nowDataSolicitacao() {
  const agora = new Date()
  const dia = String(agora.getDate()).padStart(2, '0')
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const ano = agora.getFullYear()
  const hora = String(agora.getHours()).padStart(2, '0')
  const minuto = String(agora.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`
}

export async function fetchMentorias() {
  const { data, error } = await supabase
    .from('mentorias')
    .select('*')
    .order('id')

  if (error) throw error

  return data.map(mapRowToMentoria)
}

export async function createMentoria(mentoria) {
  const row = mapMentoriaToRow(mentoria)
  if (!row.data_solicitacao) {
    row.data_solicitacao = nowDataSolicitacao()
  }

  const { data, error } = await supabase
    .from('mentorias')
    .insert([row])
    .select()
    .single()

  if (error) throw error
  return mapRowToMentoria(data)
}

export async function updateMentoria(id, mentoria) {
  const { data, error } = await supabase
    .from('mentorias')
    .update(mapMentoriaToRow(mentoria))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapRowToMentoria(data)
}

export async function deleteMentoria(id) {
  const { error } = await supabase.from('mentorias').delete().eq('id', id)
  if (error) throw error
}

export function countMentoriasByArea(list) {
  const counts = {}
  for (const mentoria of list) {
    counts[mentoria.area] = (counts[mentoria.area] ?? 0) + 1
  }
  return Object.entries(counts).map(([area, quantidade]) => ({
    area,
    quantidade,
  }))
}

export function countMentoriasByStartup(list) {
  const counts = {}
  for (const mentoria of list) {
    counts[mentoria.startup] = (counts[mentoria.startup] ?? 0) + 1
  }
  return Object.entries(counts).map(([startup, quantidade]) => ({
    startup,
    quantidade,
  }))
}

const MESES = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

function extrairMesNumero(dataMentoria) {
  if (!dataMentoria) return null
  const isoMatch = dataMentoria.match(/^\d{4}-(\d{2})-\d{2}/)
  if (isoMatch) return Number(isoMatch[1])
  const brMatch = dataMentoria.match(/^\d{2}\/(\d{2})/)
  if (brMatch) return Number(brMatch[1])
  return null
}

export function countMentoriasPorMes(list) {
  const counts = {}
  for (const mentoria of list) {
    const mes = MESES[extrairMesNumero(mentoria.dataMentoria) - 1]
    if (!mes) continue
    counts[mes] = (counts[mes] ?? 0) + 1
  }
  return MESES.filter((mes) => counts[mes]).map((mes) => ({
    mes,
    quantidade: counts[mes],
  }))
}
