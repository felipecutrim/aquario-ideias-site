-- Schema inicial do site do Aquário de Ideias.
--
-- Todos os campos de data/hora ficam como texto (text) porque a fonte
-- original (planilhas) tem valores inconsistentes (datas sem ano, textos
-- livres como "30 julho", campos em branco) — manter como texto evita
-- erros de parse na migração e casa com o que as telas já exibem hoje.
--
-- RLS (Row Level Security) fica desabilitado por enquanto: o site ainda
-- não usa Supabase Auth, apenas um login local temporário (ver
-- src/context/AuthContext.jsx). Antes de expor qualquer escrita pública
-- (ex.: o formulário de solicitação de mentoria) em produção, isso deve
-- ser revisado e políticas de RLS devem ser criadas.

create table if not exists startups (
  id bigint generated always as identity primary key,
  nome text not null,
  srl text,
  modalidade text,
  categoria text,
  setor text,
  ceo text,
  email text,
  whatsapp text,
  diagnostico text,
  plano_acao text,
  created_at timestamptz not null default now()
);

create table if not exists mentores (
  id bigint generated always as identity primary key,
  nome text not null,
  modalidade text,
  areas_especialidade text,
  created_at timestamptz not null default now()
);

create table if not exists mentorias (
  id bigint generated always as identity primary key,
  startup text,
  responsavel_startup text,
  area_mentoria text,
  mentor text,
  data_solicitacao text,
  status text,
  data_agendamento text,
  data_mentoria text,
  relatorio_recebido text,
  pagamento_mentor text,
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists capacitacoes (
  id bigint generated always as identity primary key,
  srl_trilha text,
  tema text,
  palestrante text,
  data text,
  horario text,
  created_at timestamptz not null default now()
);

create table if not exists cronograma (
  id bigint generated always as identity primary key,
  mes text,
  tipo_atividade text,
  reuniao_etapa text,
  objetivo_principal text,
  entregaveis_esperados text,
  created_at timestamptz not null default now()
);
