import { supabase } from '../lib/supabaseClient'

function mapRowToMentoria(row) {
  return {
    id: row.id,
    startup: row.startup,
    responsavelStartup: row.responsavel_startup,
    area: row.area_mentoria,
    mentor: row.mentor,
    dataSolicitacao: row.data_solicitacao,
    status: row.status,
    dataAgendamento: row.data_agendamento,
    dataMentoria: row.data_mentoria,
    relatorioRecebido: row.relatorio_recebido,
    pagamentoMentor: row.pagamento_mentor,
    observacoes: row.observacoes,
  }
}

function mapMentoriaToRow(mentoria) {
  return {
    startup: mentoria.startup,
    responsavel_startup: mentoria.responsavelStartup,
    area_mentoria: mentoria.area,
    mentor: mentoria.mentor,
    data_solicitacao: mentoria.dataSolicitacao,
    status: mentoria.status,
    data_agendamento: mentoria.dataAgendamento,
    data_mentoria: mentoria.dataMentoria,
    relatorio_recebido: mentoria.relatorioRecebido,
    pagamento_mentor: mentoria.pagamentoMentor,
    observacoes: mentoria.observacoes,
  }
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
  const { data, error } = await supabase
    .from('mentorias')
    .insert([mapMentoriaToRow(mentoria)])
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

export function countMentoriasPorMes(list) {
  const counts = {}
  for (const mentoria of list) {
    const mesNumero = Number(mentoria.dataMentoria?.split('/')[1])
    const mes = MESES[mesNumero - 1]
    if (!mes) continue
    counts[mes] = (counts[mes] ?? 0) + 1
  }
  return MESES.filter((mes) => counts[mes]).map((mes) => ({
    mes,
    quantidade: counts[mes],
  }))
}

export function countMentoriasByMentor(list) {
  const counts = {}
  for (const mentoria of list) {
    counts[mentoria.mentor] = (counts[mentoria.mentor] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([mentor, quantidade]) => ({ mentor, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
}
