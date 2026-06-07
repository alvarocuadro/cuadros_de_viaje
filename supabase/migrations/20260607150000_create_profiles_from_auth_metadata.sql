create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (
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
    nombre = excluded.nombre,
    apellido = excluded.apellido,
    "país" = excluded."país",
    email = excluded.email,
    email_verificado = excluded.email_verificado,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert
  on auth.users
  for each row execute procedure public.handle_new_user();
