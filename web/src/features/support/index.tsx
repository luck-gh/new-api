/*
Copyright (C) 2023-2026 QuantumNous
*/
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorState } from '@/components/error-state'
import { SectionPageLayout } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

import {
  getSupportTicketApiPath,
  getSupportTicketListParams,
  getSupportTicketReopenStatus,
} from './lib/support-ticket'

type Ticket = {
  id: number
  user_id: number
  subject: string
  category: string
  status: string
  updated_at: string
}
type Message = {
  id: number
  author_role: string
  content: string
  created_at: string
}
type TicketDetail = { ticket: Ticket; messages: Message[] }
type TicketList = {
  items: Ticket[]
  total: number
  page: number
  page_size: number
}
type SupportCenterProps = { admin?: boolean }

const categories = ['account', 'billing', 'api', 'other']
const statuses = ['pending_admin', 'pending_user', 'closed']
const pageSize = 20

function TicketStatus({ status }: { status: string }) {
  const { t } = useTranslation()
  const variant = status === 'closed' ? 'secondary' : 'outline'
  return <Badge variant={variant}>{t(status)}</Badge>
}

export function SupportCenter(props: SupportCenterProps) {
  const { t } = useTranslation()
  const client = useQueryClient()
  const isAdmin = props.admin === true
  const base = getSupportTicketApiPath(isAdmin)
  const [selected, setSelected] = useState<number | null>(null)
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('other')
  const [content, setContent] = useState('')
  const [reply, setReply] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [submittedKeyword, setSubmittedKeyword] = useState('')

  const tickets = useQuery({
    queryKey: [
      'support',
      isAdmin,
      page,
      statusFilter,
      categoryFilter,
      submittedKeyword,
    ],
    queryFn: async (): Promise<TicketList> => {
      const response = await api.get(base, {
        params: getSupportTicketListParams(isAdmin, {
          page,
          pageSize,
          status: statusFilter,
          category: categoryFilter,
          keyword: submittedKeyword,
        }),
      })
      return response.data.data as TicketList
    },
    refetchInterval: 30000,
  })
  const detail = useQuery({
    queryKey: ['support', 'detail', isAdmin, selected],
    enabled: selected !== null,
    queryFn: async (): Promise<TicketDetail> => {
      const response = await api.get(`${base}/${selected}`)
      return response.data.data as TicketDetail
    },
    refetchInterval: 30000,
  })
  const refresh = () => {
    void client.invalidateQueries({ queryKey: ['support'] })
  }
  const create = useMutation({
    mutationFn: () => api.post(base, { subject, category, content }),
    onSuccess: () => {
      setSubject('')
      setContent('')
      refresh()
    },
  })
  const send = useMutation({
    mutationFn: () =>
      api.post(`${base}/${selected}/messages`, { content: reply }),
    onSuccess: () => {
      setReply('')
      refresh()
    },
  })
  const changeState = useMutation({
    mutationFn: (status: string) =>
      api.put(`${base}/${selected}/state`, { status }),
    onSuccess: refresh,
  })

  useEffect(() => {
    if (!selected && tickets.data?.items[0]) {
      setSelected(tickets.data.items[0].id)
    }
  }, [selected, tickets.data])

  let nextStatus = 'closed'
  if (detail.data?.ticket.status === 'closed') {
    nextStatus = getSupportTicketReopenStatus(isAdmin)
  }
  const totalPages = Math.max(
    1,
    Math.ceil((tickets.data?.total ?? 0) / pageSize)
  )

  return (
    <SectionPageLayout>
      <SectionPageLayout.Title>
        {t(isAdmin ? 'Ticket Management' : 'Support Center')}
      </SectionPageLayout.Title>
      <SectionPageLayout.Content>
        <div className='grid gap-4 lg:grid-cols-[24rem_1fr]'>
          <aside className='border-border rounded-xl border p-4'>
            {isAdmin ? (
              <form
                className='mb-5 grid gap-2'
                onSubmit={(event) => {
                  event.preventDefault()
                  setPage(1)
                  setSubmittedKeyword(keyword.trim())
                }}
              >
                <Input
                  aria-label={t('Search tickets')}
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder={t('Search tickets')}
                />
                <div className='flex gap-2'>
                  <NativeSelect
                    aria-label={t('Status')}
                    value={statusFilter}
                    onChange={(event) => {
                      setPage(1)
                      setStatusFilter(event.target.value)
                    }}
                    className='flex-1'
                  >
                    <NativeSelectOption value=''>
                      {t('All statuses')}
                    </NativeSelectOption>
                    {statuses.map((item) => (
                      <NativeSelectOption key={item} value={item}>
                        {t(item)}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  <NativeSelect
                    aria-label={t('Category')}
                    value={categoryFilter}
                    onChange={(event) => {
                      setPage(1)
                      setCategoryFilter(event.target.value)
                    }}
                    className='flex-1'
                  >
                    <NativeSelectOption value=''>
                      {t('All categories')}
                    </NativeSelectOption>
                    {categories.map((item) => (
                      <NativeSelectOption key={item} value={item}>
                        {t(item)}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
                <Button type='submit' variant='outline'>
                  {t('Search')}
                </Button>
              </form>
            ) : (
              <form
                className='mb-5 grid gap-2'
                onSubmit={(event) => {
                  event.preventDefault()
                  create.mutate()
                }}
              >
                <Input
                  aria-label={t('Ticket subject')}
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder={t('Ticket subject')}
                  maxLength={160}
                  required
                />
                <NativeSelect
                  aria-label={t('Category')}
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <NativeSelectOption key={item} value={item}>
                      {t(item)}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <Textarea
                  aria-label={t('Message')}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder={t('Describe your issue')}
                  maxLength={10000}
                  required
                />
                <Button type='submit' disabled={create.isPending}>
                  {t('Create ticket')}
                </Button>
              </form>
            )}

            {tickets.isError ? (
              <ErrorState
                className='min-h-48'
                onRetry={() => void tickets.refetch()}
              />
            ) : null}
            {tickets.isLoading ? (
              <p className='text-muted-foreground text-sm'>{t('Loading')}</p>
            ) : null}
            {!tickets.isLoading && tickets.data?.items.length === 0 ? (
              <p className='text-muted-foreground text-sm'>
                {t('No tickets yet')}
              </p>
            ) : null}
            <div className='flex flex-col gap-2'>
              {tickets.data?.items.map((ticket) => (
                <button
                  type='button'
                  key={ticket.id}
                  onClick={() => setSelected(ticket.id)}
                  className={cn(
                    'hover:bg-accent w-full rounded-lg p-3 text-left',
                    selected === ticket.id && 'bg-accent'
                  )}
                >
                  <p className='truncate text-sm font-medium'>
                    {ticket.subject}
                  </p>
                  <div className='mt-2 flex items-center gap-2'>
                    <TicketStatus status={ticket.status} />
                    <span className='text-muted-foreground truncate text-xs'>
                      {t(ticket.category)}
                    </span>
                    {isAdmin ? (
                      <span className='text-muted-foreground text-xs'>
                        #{ticket.user_id}
                      </span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
            {tickets.data && tickets.data.total > pageSize ? (
              <div className='mt-4 flex items-center justify-between gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  {t('Previous')}
                </Button>
                <span className='text-muted-foreground text-xs'>
                  {page} / {totalPages}
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  {t('Next')}
                </Button>
              </div>
            ) : null}
          </aside>

          <main className='border-border min-h-96 rounded-xl border p-4'>
            {detail.isError ? (
              <ErrorState
                className='min-h-72'
                onRetry={() => void detail.refetch()}
              />
            ) : null}
            {detail.data ? (
              <>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <h2 className='font-semibold'>
                      {detail.data.ticket.subject}
                    </h2>
                    <div className='mt-2 flex items-center gap-2'>
                      <TicketStatus status={detail.data.ticket.status} />
                      <span className='text-muted-foreground text-xs'>
                        {t(detail.data.ticket.category)}
                      </span>
                      {isAdmin ? (
                        <span className='text-muted-foreground text-xs'>
                          #{detail.data.ticket.user_id}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => changeState.mutate(nextStatus)}
                    disabled={changeState.isPending}
                  >
                    {t(
                      detail.data.ticket.status === 'closed'
                        ? 'Reopen ticket'
                        : 'Close ticket'
                    )}
                  </Button>
                </div>
                <div className='mt-5 flex flex-col gap-3'>
                  {detail.data.messages.map((message) => (
                    <article
                      key={message.id}
                      className='bg-muted/50 rounded-lg p-3'
                    >
                      <p className='text-muted-foreground mb-1 text-xs'>
                        {t(message.author_role === 'admin' ? 'Support' : 'You')}
                      </p>
                      <p className='text-sm whitespace-pre-wrap'>
                        {message.content}
                      </p>
                    </article>
                  ))}
                </div>
                <form
                  className='mt-5 flex flex-col gap-2 sm:flex-row'
                  onSubmit={(event) => {
                    event.preventDefault()
                    send.mutate()
                  }}
                >
                  <Input
                    aria-label={t('Reply')}
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder={t('Reply')}
                    maxLength={10000}
                    required
                  />
                  <Button type='submit' disabled={send.isPending}>
                    {t('Send')}
                  </Button>
                </form>
              </>
            ) : null}
            {!detail.data && !detail.isError ? (
              <p className='text-muted-foreground text-sm'>
                {t('Select a ticket to view the conversation')}
              </p>
            ) : null}
          </main>
        </div>
      </SectionPageLayout.Content>
    </SectionPageLayout>
  )
}
