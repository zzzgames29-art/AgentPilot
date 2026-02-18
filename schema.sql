-- AgentPilot Supabase schema

create extension if not exists "pgcrypto";

create type public.lead_stage as enum (
  'New',
  'Contacted',
  'Viewing',
  'Negotiation',
  'Closed',
  'Lost'
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  budget_min numeric,
  budget_max numeric,
  expected_price numeric,
  commission_percent numeric,
  property_interest text,
  source text,
  stage public.lead_stage not null default 'New',
  next_followup_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_user_id_idx on public.leads(user_id);
create index if not exists leads_stage_idx on public.leads(stage);
create index if not exists leads_next_followup_date_idx on public.leads(next_followup_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.leads enable row level security;

create policy "Users can select own leads"
on public.leads
for select
using (auth.uid() = user_id);

create policy "Users can insert own leads"
on public.leads
for insert
with check (auth.uid() = user_id);

create policy "Users can update own leads"
on public.leads
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own leads"
on public.leads
for delete
using (auth.uid() = user_id);
