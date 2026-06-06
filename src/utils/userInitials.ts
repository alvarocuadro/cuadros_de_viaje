export function getUserInitials(nombre?: string, apellido?: string): string {
  const firstNameInitial = nombre?.trim().charAt(0) || ''
  const lastNameInitial = apellido?.trim().charAt(0) || ''
  const initials = `${firstNameInitial}${lastNameInitial}`.toLocaleUpperCase('es-AR')

  return initials || '?'
}
