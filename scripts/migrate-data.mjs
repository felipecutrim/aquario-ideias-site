// Script de migração única: popula as tabelas do Supabase com os dados
// que antes ficavam fixos em src/data/*.js. Rodar apenas uma vez (rodar
// de novo duplica as linhas, pois as tabelas não têm chave única nos dados).
//
// Uso:
//   set -a && source .env && set +a && node scripts/migrate-data.mjs

import { createClient } from '@supabase/supabase-js'
import { startupsSeed } from './seed/startups.js'
import { mentoresSeed } from './seed/mentores.js'
import { mentoriasSeed } from './seed/mentorias.js'
import { capacitacoesSeed } from './seed/capacitacoes.js'
import { cronogramaSeed } from './seed/cronograma.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ambiente antes de rodar este script.\n' +
      'Ex.: set -a && source .env && set +a && node scripts/migrate-data.mjs',
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const tables = [
  { name: 'startups', rows: startupsSeed },
  { name: 'mentores', rows: mentoresSeed },
  { name: 'mentorias', rows: mentoriasSeed },
  { name: 'capacitacoes', rows: capacitacoesSeed },
  { name: 'cronograma', rows: cronogramaSeed },
]

let hasError = false

for (const table of tables) {
  const { error } = await supabase.from(table.name).insert(table.rows)

  if (error) {
    hasError = true
    console.error(`✗ ${table.name}: ${error.message}`)
    continue
  }

  console.log(`✓ ${table.name}: ${table.rows.length} linhas inseridas`)
}

if (hasError) {
  console.error(
    '\nAlgumas tabelas falharam. Confirme que o schema.sql já foi rodado no SQL Editor do Supabase.',
  )
  process.exit(1)
}
