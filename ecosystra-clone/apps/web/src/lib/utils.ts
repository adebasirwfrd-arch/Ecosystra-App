/** Minimal className join (avoids coupling embedded app imports to host `full-kit` paths). */
export function cn(
  ...inputs: Array<string | undefined | null | false>
): string {
  return inputs.filter(Boolean).join(" ");
}

/** Used by embedded Profile UI (shadboard Avatar stack). */
export function getInitials(fullName: string): string {
  if (!fullName.length) return "";
  const names = fullName.split(" ");
  return names.map((name) => name.charAt(0).toUpperCase()).join("");
}
