import { supabase } from '../lib/supabaseClient'

function mapRowToMentor(row) {
  return {
    id: row.id,
    nome: row.nome,
    modalidade: row.modalidade,
    area: row.areas_especialidade,
  }
}

function mapMentorToRow(mentor) {
  return {
    nome: mentor.nome,
    modalidade: mentor.modalidade,
    areas_especialidade: mentor.area,
  }
}

export async function fetchMentores() {
  const { data, error } = await supabase
    .from('mentores')
    .select('*')
    .order('nome')

  if (error) throw error

  return data.map(mapRowToMentor)
}

export async function createMentor(mentor) {
  const { data, error } = await supabase
    .from('mentores')
    .insert([mapMentorToRow(mentor)])
    .select()
    .single()

  if (error) throw error
  return mapRowToMentor(data)
}

export async function updateMentor(id, mentor) {
  const { data, error } = await supabase
    .from('mentores')
    .update(mapMentorToRow(mentor))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapRowToMentor(data)
}

export async function deleteMentor(id) {
  const { error } = await supabase.from('mentores').delete().eq('id', id)
  if (error) throw error
}
