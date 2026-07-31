import { supabase } from '../lib/supabaseClient'

function mapRowToCapacitacao(row) {
  return {
    id: row.id,
    trilha: row.srl_trilha,
    tema: row.tema,
    palestrante: row.palestrante,
    data: row.data,
    horario: row.horario,
  }
}

function mapCapacitacaoToRow(capacitacao) {
  return {
    srl_trilha: capacitacao.trilha,
    tema: capacitacao.tema,
    palestrante: capacitacao.palestrante,
    data: capacitacao.data,
    horario: capacitacao.horario,
  }
}

export async function fetchCapacitacoes() {
  const { data, error } = await supabase
    .from('capacitacoes')
    .select('*')
    .order('id')

  if (error) throw error

  return data.map(mapRowToCapacitacao)
}

export async function createCapacitacao(capacitacao) {
  const { data, error } = await supabase
    .from('capacitacoes')
    .insert([mapCapacitacaoToRow(capacitacao)])
    .select()
    .single()

  if (error) throw error
  return mapRowToCapacitacao(data)
}

export async function updateCapacitacao(id, capacitacao) {
  const { data, error } = await supabase
    .from('capacitacoes')
    .update(mapCapacitacaoToRow(capacitacao))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapRowToCapacitacao(data)
}

export async function deleteCapacitacao(id) {
  const { error } = await supabase.from('capacitacoes').delete().eq('id', id)
  if (error) throw error
}
