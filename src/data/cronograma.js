import { supabase } from '../lib/supabaseClient'

function mapRowToEtapa(row) {
  return {
    id: row.id,
    mes: row.mes,
    tipoAtividade: row.tipo_atividade,
    etapa: row.reuniao_etapa,
    objetivo: row.objetivo_principal,
    entregaveis: row.entregaveis_esperados,
  }
}

function mapEtapaToRow(etapa) {
  return {
    mes: etapa.mes,
    tipo_atividade: etapa.tipoAtividade,
    reuniao_etapa: etapa.etapa,
    objetivo_principal: etapa.objetivo,
    entregaveis_esperados: etapa.entregaveis,
  }
}

export async function fetchCronograma() {
  const { data, error } = await supabase
    .from('cronograma')
    .select('*')
    .order('id')

  if (error) throw error

  return data.map(mapRowToEtapa)
}

export async function createEtapaCronograma(etapa) {
  const { data, error } = await supabase
    .from('cronograma')
    .insert([mapEtapaToRow(etapa)])
    .select()
    .single()

  if (error) throw error
  return mapRowToEtapa(data)
}

export async function updateEtapaCronograma(id, etapa) {
  const { data, error } = await supabase
    .from('cronograma')
    .update(mapEtapaToRow(etapa))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapRowToEtapa(data)
}

export async function deleteEtapaCronograma(id) {
  const { error } = await supabase.from('cronograma').delete().eq('id', id)
  if (error) throw error
}
