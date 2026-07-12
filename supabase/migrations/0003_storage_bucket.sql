-- 0003: shelf_photos Storage bucket (Sprint 1 — Database & Master Data)

insert into storage.buckets (id, name, public)
values ('shelf_photos', 'shelf_photos', true)
on conflict (id) do nothing;

-- v1 permissive policies on this bucket's objects, matching the open-demo
-- RLS model used on every table in 0001_init.sql. Lock-down sprint replaces
-- these with owner-scoped policies alongside the rest of the schema.
drop policy if exists "shelf_photos_v1_read" on storage.objects;
create policy "shelf_photos_v1_read" on storage.objects for select
  using (bucket_id = 'shelf_photos');

drop policy if exists "shelf_photos_v1_insert" on storage.objects;
create policy "shelf_photos_v1_insert" on storage.objects for insert
  with check (bucket_id = 'shelf_photos');

drop policy if exists "shelf_photos_v1_update" on storage.objects;
create policy "shelf_photos_v1_update" on storage.objects for update
  using (bucket_id = 'shelf_photos');

drop policy if exists "shelf_photos_v1_delete" on storage.objects;
create policy "shelf_photos_v1_delete" on storage.objects for delete
  using (bucket_id = 'shelf_photos');
