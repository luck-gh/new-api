/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { Link } from '@tanstack/react-router'
import { Bell, BookOpen, LifeBuoy, Settings2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SectionPageLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'

export function SupportCenter() {
  const { t } = useTranslation()

  return (
    <SectionPageLayout>
      <SectionPageLayout.Title>{t('Support Center')}</SectionPageLayout.Title>
      <SectionPageLayout.Content>
        <div className='mx-auto w-full max-w-5xl'>
          <div className='border-border/60 bg-card rounded-2xl border p-7 sm:p-10'>
            <div className='bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl'>
              <LifeBuoy className='size-6' />
            </div>
            <h1 className='mt-6 text-2xl font-semibold tracking-tight'>
              {t('support.unavailable.title')}
            </h1>
            <p className='text-muted-foreground mt-3 max-w-2xl text-sm leading-7'>
              {t('support.unavailable.description')}
            </p>

            <div className='mt-8 grid gap-3 sm:grid-cols-2'>
              <Link
                to='/docs'
                className='border-border/60 hover:bg-accent/40 flex items-start gap-3 rounded-xl border p-4 transition-colors'
              >
                <BookOpen className='text-primary mt-0.5 size-4' />
                <span>
                  <strong className='block text-sm'>
                    {t('support.readDocs')}
                  </strong>
                  <span className='text-muted-foreground mt-1 block text-xs leading-5'>
                    {t('support.readDocsDescription')}
                  </span>
                </span>
              </Link>
              <button
                type='button'
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('open-notification-center')
                  )
                }
                className='border-border/60 hover:bg-accent/40 flex items-start gap-3 rounded-xl border p-4 text-left transition-colors'
              >
                <Bell className='text-primary mt-0.5 size-4' />
                <span>
                  <strong className='block text-sm'>
                    {t('support.checkNotice')}
                  </strong>
                  <span className='text-muted-foreground mt-1 block text-xs leading-5'>
                    {t('support.checkNoticeDescription')}
                  </span>
                </span>
              </button>
            </div>

            <div className='border-border/60 bg-muted/25 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4'>
              <div className='flex items-start gap-3'>
                <Settings2 className='text-muted-foreground mt-0.5 size-4' />
                <p className='text-muted-foreground text-xs leading-5'>
                  {t('support.adminHint')}
                </p>
              </div>
              <Button
                variant='outline'
                size='sm'
                render={<Link to='/profile' />}
              >
                {t('Profile')}
              </Button>
            </div>
          </div>
        </div>
      </SectionPageLayout.Content>
    </SectionPageLayout>
  )
}
