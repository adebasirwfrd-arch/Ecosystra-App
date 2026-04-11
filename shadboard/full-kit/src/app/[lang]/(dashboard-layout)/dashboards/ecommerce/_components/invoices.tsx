import type { InvoiceType } from "../types"

import { InvoicesTable } from "./invoices-table"

export function Invoices({
  invoices,
  deliveryStatuses,
}: {
  invoices: InvoiceType[]
  deliveryStatuses: Array<{ label: string; value: string }>
}) {
  return (
    <article className="col-span-full">
      <InvoicesTable data={invoices} deliveryStatuses={deliveryStatuses} />
    </article>
  )
}
