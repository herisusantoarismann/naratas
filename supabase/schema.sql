-- ===================================================
-- NARATAS ENGINE: Supabase Database Schema
-- Table: shared_documents
-- ===================================================

-- 1. Buat tabel shared_documents
create table if not exists public.shared_documents (
  id text primary key,
  title text not null default 'Untitled Document',
  blocks jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.shared_documents enable row level security;

-- 3. Policy: Siapa pun (anon) dapat membaca shared documents
create policy "Public can view shared documents"
  on public.shared_documents
  for select
  to public
  using (true);

-- 4. Policy: Siapa pun (anon) dapat membuat share document baru
create policy "Public can insert shared documents"
  on public.shared_documents
  for insert
  to public
  with check (true);

-- Indexing untuk pencarian cepat berdasarkan ID dan timestamp
create index if not exists idx_shared_docs_created_at on public.shared_documents (created_at desc);
