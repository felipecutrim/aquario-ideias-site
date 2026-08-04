-- Migração 002: reestrutura mentorias, adiciona campos em mentores e startups.
--
-- mentorias: remove data_agendamento e pagamento_mentor (não usados mais);
-- adiciona preferencia_horario, whatsapp_responsavel, email_responsavel e
-- urgencia — campos que antes ficavam misturados dentro de "observacoes"
-- no formulário público de solicitação e agora viram colunas próprias.
alter table mentorias
  drop column if exists data_agendamento,
  drop column if exists pagamento_mentor,
  add column if not exists preferencia_horario text,
  add column if not exists whatsapp_responsavel text,
  add column if not exists email_responsavel text,
  add column if not exists urgencia text;

-- mentores: dados de contato e apresentação de cada mentor.
alter table mentores
  add column if not exists email text,
  add column if not exists whatsapp text,
  add column if not exists chave_pix text,
  add column if not exists mini_biografia text;

-- startups: acompanhamento do agendamento de mentoria da startup.
alter table startups
  add column if not exists agendamento_mentoria text;
