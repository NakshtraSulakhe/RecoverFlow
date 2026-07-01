import { useState, useCallback } from 'react'

interface UsePaginationProps {
  initialPage?: number
  initialPageSize?: number
  totalItems?: number
}

interface UsePaginationReturn {
  page: number
  pageSize: number
  totalPages: number
  startIndex: number
  endIndex: number
  canPreviousPage: boolean
  canNextPage: boolean
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  setPageSize: (pageSize: number) => void
  reset: () => void
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems = 0,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)))
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(page + 1)
  }, [page, goToPage])

  const previousPage = useCallback(() => {
    goToPage(page - 1)
  }, [page, goToPage])

  const reset = useCallback(() => {
    setPage(initialPage)
    setPageSize(initialPageSize)
  }, [initialPage, initialPageSize])

  return {
    page,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    canPreviousPage: page > 1,
    canNextPage: page < totalPages,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    reset,
  }
}
