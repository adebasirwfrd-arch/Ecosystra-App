/** Indonesian Rupiah display for board Budget column (GRANDBOOK / table numeric formatting). */
export function formatIdr(amount: number): string {
  if (!Number.isFinite(amount)) return "Rp\u00a00"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
}
