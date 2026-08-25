/*
Copyright (C) 2023-2026 QuantumNous
*/
export type SupportTicketFilters = {
  page: number
  pageSize: number
  status: string
  category: string
  keyword: string
}

export function getSupportTicketApiPath(admin: boolean): string {
  if (admin) return '/api/support/admin/tickets'
  return '/api/user/support/tickets'
}

export function getSupportTicketListParams(
  admin: boolean,
  filters: SupportTicketFilters
): Record<string, number | string | undefined> {
  return {
    p: filters.page,
    page_size: filters.pageSize,
    status: filters.status || undefined,
    category: filters.category || undefined,
    keyword: admin ? filters.keyword || undefined : undefined,
  }
}

export function getSupportTicketReopenStatus(admin: boolean): string {
  return admin ? 'pending_user' : 'pending_admin'
}
