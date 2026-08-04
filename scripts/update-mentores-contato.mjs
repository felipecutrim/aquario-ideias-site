// Script de atualização única: preenche email, whatsapp e mini biografia
// dos mentores já cadastrados (identificados pelo nome exato). Rodar só
// depois de aplicar supabase/migration_002.sql.
//
// Uso:
//   set -a && source .env && set +a && node scripts/update-mentores-contato.mjs

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ambiente antes de rodar este script.',
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const atualizacoes = [
  {
    nome: 'Felipe Andre Junqueira',
    email: 'felipe@numerosfalam.com.br',
    whatsapp: '11993722597',
    mini_biografia:
      'Felipe Junqueira é fundador da consultoria Números Falam, especializada em organizar as finanças de pequenos e médios empresários. Com linguagem simples e foco em resultados, ajuda empreendedores a conquistarem clareza e lucro. Apaixonado por transformar empresas com planejamento financeiro acessível e estratégico.',
  },
  {
    nome: 'Juliana Duarte Vieira Amaral',
    email: 'contato.jdva@gmail.com',
    whatsapp: '(13) 99620-9878',
    mini_biografia:
      'Licenciada em Letras, Bacharela em Direito e Especialista em Revisão Textual, Advocacia Consultiva e Direito Público. Atuo há oito anos como editora de textos e há três anos no campo do direito, unindo a precisão jurídica à boa comunicação.',
  },
  {
    nome: 'Fabiano de Oliveira Albers',
    email: 'fabiano.oalbers@sp.senac.br',
    whatsapp: '13981102265',
    mini_biografia:
      'Docente de TI com mais de 15 anos de experiência, especialista em Web, Mobile e Inteligência Artificial. Professor no SENAC Registro e ex-coordenador de ADS na UNISEPE-FVR. Atua com programação, banco de dados SQL, virtualização e soluções com IA aplicada à educação.',
  },
  {
    nome: 'Renan Martins de Almeida',
    email: 'renan.ing@gmail.com',
    whatsapp: '13974221078',
    mini_biografia:
      'Sou Engenheiro e Consultor em Tecnologia no SENAI-SP, atuando com inovação, gestão industrial e desenvolvimento de novos produtos e negócios. Tenho experiência com grandes empresas e governos, unindo visão estratégica e foco em resultados.',
  },
  {
    nome: 'Victor Yagyu',
    email: 'coopfilms.br@gmail.com',
    whatsapp: '(11) 96868-2312',
    mini_biografia:
      'Produtor e diretor com mais de 15 anos de experiência no mercado de Comunicação e audiovisual. Formação em Comunicação social - Publicidade e Propaganda. Integrante do Conselho Municipal de Cultura de Registro. Sócio fundador da Coop Audiovisual, cocriador do Registro City, e sócio fundador da Ribeira Plus, grupo de comunicação, cobertura e transmissão ao vivo.',
  },
  {
    nome: 'Kaio Guilherme de Oliveira Gallo',
    email: 'kaiogallo14@gmail.com',
    whatsapp: '1397445512',
    mini_biografia:
      'Profissional Contábil, sócio de escritório, com mais de 5 anos de experiência no ramo contábil.',
  },
  {
    nome: 'Jucilene Ribeiro Machado',
    email: 'jcileneribeiro@gmail.com',
    whatsapp: '13 99626-5526',
    mini_biografia:
      'Formada em Administração, mais de 20 anos de experiência, empresária e atua mais de 12 como professora em cursos Técnicos e Superior.',
  },
  {
    nome: 'Ana Claudia Martins Ciconelle',
    email: 'acmarc@gmail.com',
    whatsapp: '11 992426686',
    mini_biografia:
      'Ana Ciconelle é doutoranda em Estatística pela USP e sócia-fundadora da MaChiron. Atua no desenvolvimento de soluções em IA para a saúde e na estruturação de projetos aprovados em linhas de fomento como o PIPE/FAPESP.',
  },
  {
    nome: 'Luiz Claudio Chiavini Oliveira Júnior',
    email: 'luizchiavini@gmail.com',
    whatsapp: '13997721305',
    mini_biografia:
      'Luiz Cláudio Chiavini Oliveira Júnior é instrutor de formação profissional no SENAI-SP, com experiência em tecnologia, inovação e educação técnica. Atua no desenvolvimento de projetos educacionais e na capacitação de jovens para o mercado de trabalho.',
  },
  {
    nome: 'Thauany Magalhães',
    email: 'atendimento@agenciamabra.com.br',
    whatsapp: '19999642424',
    mini_biografia:
      'Engenheira Agrônoma, especialista em Marketing e Vendas, proprietária da Agência Mabra Marketing com 5 anos de atuação em grandes empresas de todo o Brasil.',
  },
  {
    nome: 'Caio Flavio Stettiner',
    email: 'cstettiner@gmail.com',
    whatsapp: '11-994185757',
    mini_biografia:
      'Empreendedor, Inovador e Professor no Centro Paula Souza, doutor em Administração, ministra aulas de Empreendedorismo e Inovação há 15 anos, empreendedor em Comércio Exterior e Varejo, ministra aulas de pós graduação na FGV Educação Executiva.',
  },
  {
    nome: 'Leonardo Raupp Matta',
    email: 'raupp.leonardo@gmail.com',
    whatsapp: '13997481171',
    mini_biografia:
      'Docente e consultor, graduado em Administração, pós-graduado em Marketing e Vendas, com formações e certificações em Inovação, Liderança e Melhoria de Processos. Possui experiência em Educação, Empreendedorismo, Marketing, Varejo e Consultorias.',
  },
  {
    nome: 'Alexander Homenko Neto',
    email: 'profhomenko@gmail.com',
    whatsapp: '11-932301495',
    mini_biografia:
      'Doutor, Mestre e Especialista em Administração. Experiência profissional de 16 anos em Cadeia de Suprimentos e Controladoria. Experiência Acadêmica de 17 anos como Coordenador de cursos de Graduação e Especialização, assim como Professor em disciplinas de Planejamento Estratégico e Projetos Interdisciplinares.',
  },
  {
    nome: 'Tavani Rocha Camargo',
    email: 'contato@sampleinovacao.com.br',
    whatsapp: '11995034587',
    mini_biografia:
      'Sócia fundadora e diretora de pesquisa da empresa SAMPLE Inovação e Biotecnologia na Produção Animal LTDA. Atua com pesquisa e inovação em biotecnologia aplicada, desenvolve novos produtos, testes de eficácia e processos técnicos relacionados a produção de organismos aquáticos.',
  },
  {
    nome: 'Naor Silveira Fialho',
    email: 'consultoriasample@gmail.com',
    whatsapp: '12 9987843659',
    mini_biografia:
      'Sócio Administrador da SAMPLE. Atua com pesquisa e inovação em biotecnologia aplicada, desenvolve novos produtos, testes de eficácia e processos técnicos relacionados a produção de organismos aquáticos.',
  },
  {
    nome: 'Elisa Maia de Godoy',
    email: 'godoy.emaia@gmail.com',
    whatsapp: '13981520715',
    mini_biografia:
      'Pesquisadora e empreendedora com experiência em projetos de P,D&I e ex-fundadora de startup de base científica. Integra ecossistema de inovação desde 2017.',
  },
  {
    nome: 'Felipe Odake',
    email: 'felipe.odake@gmail.com',
    whatsapp: '(13)99710-8348',
    mini_biografia:
      'Engenheiro Eletricista formado pela Universidade Federal do Paraná (UFPR) e pós-graduado em Administração de Empresas pela Fundação Getúlio Vargas (FGV), sou especialista em incentivos fiscais para inovação tecnológica, pesquisa e desenvolvimento.',
  },
]

let hasError = false

for (const mentor of atualizacoes) {
  const { nome, ...payload } = mentor
  const { data, error } = await supabase
    .from('mentores')
    .update(payload)
    .eq('nome', nome)
    .select()

  if (error) {
    hasError = true
    console.error(`✗ ${nome}: ${error.message}`)
    continue
  }

  if (!data || data.length === 0) {
    hasError = true
    console.error(`✗ ${nome}: nenhuma linha encontrada com esse nome`)
    continue
  }

  console.log(`✓ ${nome}`)
}

if (hasError) {
  console.error('\nAlgumas atualizações falharam — veja os detalhes acima.')
  process.exit(1)
}
