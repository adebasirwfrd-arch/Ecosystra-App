import type { Metadata } from "next"

import { getShadboardPageContent } from "@/lib/get-shadboard-page-content"

import type {
  ChurnRateType,
  CustomerInsightsType,
  InvoiceType,
  OverviewType,
  RevenueBySourceType,
  SalesTrendType,
  TopProductType,
} from "./types"

import type { GenderDistributionType } from "../analytics/types"

import { ChurnRate } from "./_components/churn-rate"
import { CustomerInsights } from "./_components/customer-insights"
import { GenderDistribution } from "./_components/gender-distribution"
import { Invoices } from "./_components/invoices"
import { Overview } from "./_components/overview"
import { RevenueBySource } from "./_components/revenue-by-source"
import { SalesTrend } from "./_components/sales-trend"
import { TopProducts } from "./_components/top-products"

export const metadata: Metadata = {
  title: "Ecommerce",
}

export default async function EcommercePage() {
  const b = await getShadboardPageContent("ecommerce")

  return (
    <section className="container grid gap-4 p-4 md:grid-cols-2">
      <Overview data={b.overview as OverviewType} />
      <ChurnRate data={b.churnRateData as ChurnRateType} />
      <RevenueBySource data={b.revenueBySourceData as RevenueBySourceType} />
      <div className="col-span-full grid gap-4 md:grid-cols-4">
        <CustomerInsights data={b.customerInsightsData as CustomerInsightsType} />
        <GenderDistribution data={b.genderDistributionData as GenderDistributionType[]} />
      </div>
      <SalesTrend data={b.salesTrendData as SalesTrendType} />
      <TopProducts data={b.topProductsData as TopProductType} />
      <Invoices
        invoices={b.invoicesData as InvoiceType[]}
        deliveryStatuses={
          b.deliveryStatusesData as Array<{ label: string; value: string }>
        }
      />
    </section>
  )
}
