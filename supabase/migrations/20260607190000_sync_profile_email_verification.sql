create or replace function public.sync_profile_email_verification()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.profiles as profile
  set
    email = coalesce(new.email, profile.email),
    email_verificado = new.email_confirmed_at is not null,
    updated_at = now()
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_email_verification_changed on auth.users;

create trigger on_auth_user_email_verification_changed
  after update of email, email_confirmed_at
  on auth.users
  for each row execute procedure public.sync_profile_email_verification();

update public.profiles as profile
set
  email = auth_user.email,
  email_verificado = auth_user.email_confirmed_at is not null,
  updated_at = now()
from auth.users as auth_user
where profile.id = auth_user.id;
