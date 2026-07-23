/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useLocation } from '@tanstack/react-router'
import { AlertCircle, LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'

import { ApiReference } from './api-reference'
import { DocsHome } from './docs-home'
import { DesktopDocsNavigation, MobileDocsNavigation } from './docs-navigation'
import { GuidePage } from './guide-page'
import { useDocsData } from './use-docs-data'

export function Docs() {
  const { t } = useTranslation()
  const location = useLocation()
  const { status } = useStatus()
  const { systemName } = useSystemConfig()
  const apiBase =
    (status?.server_address as string | undefined)?.replace(/\/$/, '') ||
    window.location.origin
  const docsQuery = useDocsData(apiBase)
  const pathname = location.pathname.replace(/\/+$/, '') || '/docs'
  const guides = docsQuery.data?.guides || []
  const endpoints = docsQuery.data?.endpoints || []
  const activeGuide = guides.find((guide) => guide.route === pathname)

  useEffect(() => {
    document.title = `${t('docs.title')} · ${systemName}`
  }, [systemName, t])

  let content: React.ReactNode
  if (docsQuery.isLoading) {
    content = (
      <div className='flex min-h-80 items-center justify-center'>
        <LoaderCircle className='text-muted-foreground size-6 animate-spin' />
        <span className='sr-only'>{t('docs.loading')}</span>
      </div>
    )
  } else if (docsQuery.isError) {
    content = (
      <div className='border-destructive/25 bg-destructive/5 rounded-xl border px-6 py-12 text-center'>
        <AlertCircle className='text-destructive mx-auto size-7' />
        <h1 className='mt-4 text-lg font-semibold'>{t('docs.error.title')}</h1>
        <p className='text-muted-foreground mt-2 text-sm'>
          {t('docs.error.description')}
        </p>
        <Button
          variant='outline'
          className='mt-5'
          onClick={() => docsQuery.refetch()}
        >
          {t('Retry')}
        </Button>
      </div>
    )
  } else if (pathname === '/docs/api') {
    content = <ApiReference endpoints={endpoints} apiBase={apiBase} />
  } else if (pathname.startsWith('/docs/guides/')) {
    content = (
      <GuidePage guide={activeGuide} guides={guides} apiBase={apiBase} />
    )
  } else {
    content = <DocsHome guides={guides} />
  }

  return (
    <PublicLayout showMainContainer={false}>
      <div className='mx-auto w-full max-w-[96rem] px-4 pt-24 sm:px-6 lg:px-8'>
        <div className='border-border/60 mb-6 flex items-center justify-between border-b pb-4 lg:hidden'>
          <div>
            <p className='text-sm font-semibold'>{t('docs.title')}</p>
            <p className='text-muted-foreground mt-0.5 text-xs'>
              {t('docs.navigation.description')}
            </p>
          </div>
          <MobileDocsNavigation guides={guides} pathname={pathname} />
        </div>

        <div className='grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]'>
          <DesktopDocsNavigation guides={guides} pathname={pathname} />
          <div className='min-w-0'>{content}</div>
        </div>
      </div>
      <Footer className='mt-8' />
    </PublicLayout>
  )
}
