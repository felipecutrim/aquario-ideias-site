import { supabase } from '../lib/supabaseClient'

export async function fetchCapacitacoes() {
  const { data, error } = await supabase
    .from('capacitacoes')
    .select('*')
    .order('id')

  if (error) throw error

  return data.map((row) => ({
    trilha: row.srl_trilha,
    tema: row.tema,
    palestrante: row.palestrante,
    horario: row.horario || row.data || '—',
  }))
}
