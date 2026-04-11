/** Minimal className join (avoids coupling embedded app imports to host `full-kit` paths). */
export function cn(
  ...inputs: Array<string | undefined | null | false>
): string {
  return inputs.filter(Boolean).join(' ');
}
