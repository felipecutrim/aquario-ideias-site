-- Migração 003: campo de contrato (PDF) para startups.
alter table startups
  add column if not exists contrato_url text;

-- Políticas do bucket "contratos" no Storage.
-- O bucket em si precisa ser criado antes pelo painel do Supabase
-- (Storage > New bucket > nome "contratos", marcar como público).
-- Como o site ainda não usa Supabase Auth (login local temporário),
-- as políticas abaixo liberam leitura e upload públicos apenas para
-- esse bucket — mesmo racional do restante do projeto (RLS
-- desabilitado por enquanto, revisar antes de produção real).
create policy "Leitura publica de contratos"
on storage.objects for select
to anon
using (bucket_id = 'contratos');

create policy "Upload publico de contratos"
on storage.objects for insert
to anon
with check (bucket_id = 'contratos');

create policy "Atualizacao publica de contratos"
on storage.objects for update
to anon
using (bucket_id = 'contratos');

create policy "Exclusao publica de contratos"
on storage.objects for delete
to anon
using (bucket_id = 'contratos');
