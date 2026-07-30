import { supabase } from '../lib/supabaseClient'

export async function fetchMentores() {
  const { data, error } = await supabase
    .from('mentores')
    .select('*')
    .order('nome')

  if (error) throw error

  return data.map((row) => ({
    nome: row.nome,
    modalidade: row.modalidade,
    area: row.areas_especialidade,
  }))
}
