/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { Navigate } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { useStatus } from '@/hooks/use-status'

export function ExternalDocsRedirect() {
  const { t } = useTranslation()
  const { status, loading } = useStatus()
  const docsUrl = (status?.docs_link as string | undefined)?.trim()

  useEffect(() => {
    if (docsUrl) window.location.replace(docsUrl)
  }, [docsUrl])

  if (!docsUrl && !loading) return <Navigate to='/' replace />

  return (
    <PublicLayout showMainContainer={false}>
      <main className='flex min-h-screen items-center justify-center'>
        <LoaderCircle className='text-muted-foreground size-6 animate-spin' />
        <span className='sr-only'>{t('Loading...')}</span>
      </main>
    </PublicLayout>
  )
}
