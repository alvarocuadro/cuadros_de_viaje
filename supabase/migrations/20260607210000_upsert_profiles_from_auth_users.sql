create or replace function public.upsert_profile_from_auth_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles as profile (
    id,
    nombre,
    apellido,
    "país",
    email,
    email_verificado
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', ''),
    coalesce(new.raw_user_meta_data ->> 'apellido', ''),
    coalesce(new.raw_user_meta_data ->> 'país', ''),
    coalesce(new.email, ''),
    new.email_confirmed_at is not null
  )
  on conflict (id) do update
  set
    nombre = coalesce(nullif(excluded.nombre, ''), profile.nombre),
    apellido = coalesce(nullif(excluded.apellido, ''), profile.apellido),
    "país" = coalesce(nullif(excluded."país", ''), profile."país"),
    email = excluded.email,
    email_verificado = excluded.email_verificado,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_email_verification_changed on auth.users;

create trigger on_auth_user_created
  after insert
  on auth.users
  for each row execute procedure public.upsert_profile_from_auth_user();

create trigger on_auth_user_email_verification_changed
  after update of email, email_confirmed_at
  on auth.users
  for each row execute procedure public.upsert_profile_from_auth_user();

insert into public.profiles as profile (
  id,
  nombre,
  apellido,
  "país",
  email,
  email_verificado
)
select
  auth_user.id,
  coalesce(auth_user.raw_user_meta_data ->> 'nombre', ''),
  coalesce(auth_user.raw_user_meta_data ->> 'apellido', ''),
  coalesce(auth_user.raw_user_meta_data ->> 'país', ''),
  coalesce(auth_user.email, ''),
  auth_user.email_confirmed_at is not null
from auth.users as auth_user
on conflict (id) do update
set
  nombre = coalesce(nullif(excluded.nombre, ''), profile.nombre),
  apellido = coalesce(nullif(excluded.apellido, ''), profile.apellido),
  "país" = coalesce(nullif(excluded."país", ''), profile."país"),
  email = excluded.email,
  email_verificado = excluded.email_verificado,
  updated_at = now();

drop function if exists public.handle_new_user();
drop function if exists public.sync_profile_email_verification();
