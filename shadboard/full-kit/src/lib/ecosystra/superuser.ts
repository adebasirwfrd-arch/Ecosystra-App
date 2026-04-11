export const SUPER_USER_EMAIL = "ade.basirwfrd@gmail.com";

export function isSuperUserEmail(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === SUPER_USER_EMAIL.toLowerCase();
}
