import type { Metadata } from "next"

import { SalesManagementApp } from "@/components/sales-management/sales-management-app"

export const metadata: Metadata = {
  title: "Sales Management",
}

export default function SalesManagementPage() {
  return <SalesManagementApp />
}
