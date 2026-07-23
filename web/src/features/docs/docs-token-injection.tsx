/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { KeyRound, LoaderCircle, LogIn, ShieldAlert, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { fetchTokenKey, getApiKeys } from '@/features/keys/api'
import { useAuthStore } from '@/stores/auth-store'

import { useDocsTokenStore } from './docs-token-store'

export function DocsTokenInjection() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.auth.user)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const {
    userId: tokenUserId,
    tokenId,
    tokenName,
    token,
    setToken,
    clearToken,
  } = useDocsTokenStore()
  const tokenBelongsToUser = user?.id === tokenUserId
  const activeTokenId = tokenBelongsToUser ? tokenId : null
  const activeTokenName = tokenBelongsToUser ? tokenName : ''
  const activeToken = tokenBelongsToUser ? token : ''
  const tokenQuery = useQuery({
    queryKey: ['docs', 'api-keys', user?.id],
    queryFn: () => getApiKeys({ p: 1, size: 100 }),
    enabled: Boolean(user),
    staleTime: 60_000,
  })
  const keys = (tokenQuery.data?.data?.items || []).filter(
    (item) => item.status === 1
  )

  const selectToken = async (value: string) => {
    if (!value) {
      clearToken()
      return
    }
    if (!user) return
    const id = Number(value)
    const key = keys.find((item) => item.id === id)
    if (!key) return
    setLoadingId(id)
    try {
      const response = await fetchTokenKey(id)
      if (!response.success || !response.data?.key) {
        throw new Error(response.message || t('docs.token.loadFailed'))
      }
      setToken(user.id, id, key.name, response.data.key)
      toast.success(t('docs.token.injected', { name: key.name }))
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('docs.token.loadFailed')
      )
    } finally {
      setLoadingId(null)
    }
  }

  if (!user) {
    return (
      <div className='border-border/60 bg-muted/25 mb-7 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4'>
        <div className='flex min-w-0 items-start gap-3'>
          <LogIn className='text-primary mt-0.5 size-4 shrink-0' />
          <div>
            <p className='text-sm font-medium'>{t('docs.token.loginTitle')}</p>
            <p className='text-muted-foreground mt-1 text-xs leading-5'>
              {t('docs.token.loginDescription')}
            </p>
          </div>
        </div>
        <Button size='sm' render={<Link to='/sign-in' />}>
          {t('Login')}
        </Button>
      </div>
    )
  }

  return (
    <div className='border-primary/20 bg-primary/5 mb-7 rounded-xl border p-4'>
      <div className='flex flex-wrap items-center gap-3'>
        <KeyRound className='text-primary size-4 shrink-0' />
        <label htmlFor='docs-token-selector' className='text-sm font-medium'>
          {t('docs.token.label')}
        </label>
        <select
          id='docs-token-selector'
          value={activeTokenId ?? ''}
          onChange={(event) => void selectToken(event.target.value)}
          disabled={tokenQuery.isLoading || loadingId !== null}
          className='border-input bg-background focus:ring-ring h-9 min-w-56 flex-1 rounded-lg border px-3 text-sm outline-none focus:ring-2'
        >
          <option value=''>{t('docs.token.placeholder')}</option>
          {keys.map((key) => (
            <option key={key.id} value={key.id}>
              {key.name}
            </option>
          ))}
        </select>
        {loadingId !== null ? (
          <LoaderCircle className='size-4 animate-spin' />
        ) : null}
        {activeToken ? (
          <Button variant='ghost' size='sm' onClick={clearToken}>
            <X className='size-4' />
            {t('docs.token.clear')}
          </Button>
        ) : null}
      </div>
      <div className='text-muted-foreground mt-3 flex gap-2 text-xs leading-5'>
        <ShieldAlert className='mt-0.5 size-3.5 shrink-0' />
        <span>
          {activeToken
            ? t('docs.token.activeWarning', { name: activeTokenName })
            : t('docs.token.sessionWarning')}
        </span>
      </div>
    </div>
  )
}
