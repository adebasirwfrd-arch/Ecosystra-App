import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react"

import { useEmailContext } from "../_hooks/use-email-context"
import { Button } from "@/components/ui/button"
import { CardHeader } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { EmailListSearchForm } from "./email-list-search-form"
import { EmailMenuButton } from "./email-menu-button"

interface EmailListHeaderProps {
  totalPages: number
  currentPage: number
}

export function EmailListHeader({ totalPages, currentPage }: EmailListHeaderProps) {
  const { refetchEmails } = useEmailContext()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()

  const filterParam = params.filter as string

  const pageQuery = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string, 10) || 1
    : 1

  return (
    <CardHeader className="flex-row justify-between items-center gap-x-1.5 space-y-0 px-3 pb-0">
      <EmailMenuButton isIcon />
      <EmailListSearchForm pageQuery={pageQuery} filterParam={filterParam} />
      <Button
        variant="ghost"
        size="icon"
        className="ms-auto"
        type="button"
        onClick={() => {
          void refetchEmails()
        }}
        aria-label="Refresh emails"
      >
        <RotateCw className="h-4 w-4" />
      </Button>
      <Pagination className="w-fit mx-0">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => {
                router.push(`${pathname}?page=${Math.max(1, currentPage - 1)}`)
              }}
              aria-label="Go to previous page"
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 rtl:-scale-100" />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => {
                router.push(
                  `${pathname}?page=${Math.min(totalPages, currentPage + 1)}`
                )
              }}
              aria-label="Go to next page"
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4 rtl:-scale-100" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </CardHeader>
  )
}
