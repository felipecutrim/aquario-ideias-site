export const mentorias = [
  {
    id: 'M01',
    startup: 'Pluralgae',
    responsavelStartup: 'Mariana Fortes',
    area: 'Editais de Fomento',
    mentor: 'Elisa Maia de Godoy',
    dataSolicitacao: '',
    status: 'Concluída',
    dataAgendamento: '',
    dataMentoria: '01/07',
    relatorioRecebido: '',
    pagamentoMentor: '',
    observacoes: '',
  },
  {
    id: 'M02',
    startup: 'Explores do Porquê Educação Científica',
    responsavelStartup: 'Sara Nállia',
    area: 'Contábil',
    mentor: 'Kaio Guilherme de Oliveira Gallo',
    dataSolicitacao: '',
    status: 'Agendada',
    dataAgendamento: '',
    dataMentoria: '04/05',
    relatorioRecebido: '',
    pagamentoMentor: '',
    observacoes: '',
  },
  {
    id: 'M03',
    startup: 'AZB Environment Sampling',
    responsavelStartup: 'André Zuffo Buoratti',
    area: 'Jurídico',
    mentor: 'Antony Jefferson',
    dataSolicitacao: '',
    status: 'Agendada',
    dataAgendamento: '',
    dataMentoria: '16/06',
    relatorioRecebido: '',
    pagamentoMentor: '',
    observacoes: '',
  },
  {
    id: 'M04',
    startup: 'Nexus Cidadão',
    responsavelStartup: 'Yuri Leite',
    area: 'Marketing e Vendas',
    mentor: 'Victor Yagyu',
    dataSolicitacao: '',
    status: 'Agendada',
    dataAgendamento: '',
    dataMentoria: '18/06',
    relatorioRecebido: '',
    pagamentoMentor: '',
    observacoes: '',
  },
  {
    id: 'M05',
    startup: 'FWS Consultoria',
    responsavelStartup: 'Daniel Santiago Rucinque',
    area: 'Jurídico',
    mentor: 'Juliana Duarte Vieira Amaral',
    dataSolicitacao: '',
    status: 'Agendada',
    dataAgendamento: '',
    dataMentoria: '22/06',
    relatorioRecebido: '',
    pagamentoMentor: '',
    observacoes: '',
  },
  {
    id: 'M06',
    startup: 'FWS Consultoria',
    responsavelStartup: 'Daniel Santiago Rucinque',
    area: 'Finanças',
    mentor: 'Felipe Andre Junqueira',
    dataSolicitacao: '',
    status: 'Agendada',
    dataAgendamento: '',
    dataMentoria: '22/06',
    relatorioRecebido: '',
    pagamentoMentor: '',
    observacoes: '',
  },
  {
    id: 'M07',
    startup: 'FWS Consultoria',
    responsavelStartup: 'Daniel Santiago Rucinque',
    area: 'Processos',
    mentor: 'Tavani Rocha Camargo',
    dataSolicitacao: '',
    status: 'Agendada',
    dataAgendamento: '',
    dataMentoria: '22/06',
    relatorioRecebido: '',
    pagamentoMentor: '',
    observacoes: '',
  },
]

export function countMentoriasByArea(list = mentorias) {
  const counts = {}
  for (const mentoria of list) {
    counts[mentoria.area] = (counts[mentoria.area] ?? 0) + 1
  }
  return Object.entries(counts).map(([area, quantidade]) => ({
    area,
    quantidade,
  }))
}

export function countMentoriasByStartup(list = mentorias) {
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

export function countMentoriasPorMes(list = mentorias) {
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

export function countMentoriasByMentor(list = mentorias) {
  const counts = {}
  for (const mentoria of list) {
    counts[mentoria.mentor] = (counts[mentoria.mentor] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([mentor, quantidade]) => ({ mentor, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
}
