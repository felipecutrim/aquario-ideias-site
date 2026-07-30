import { supabase } from '../lib/supabaseClient'

export async function fetchCronograma() {
  const { data, error } = await supabase
    .from('cronograma')
    .select('*')
    .order('id')

  if (error) throw error

  return data.map((row) => ({
    mes: row.mes,
    tipoAtividade: row.tipo_atividade,
    etapa: row.reuniao_etapa,
    objetivo: row.objetivo_principal,
    entregaveis: row.entregaveis_esperados,
  }))
}
