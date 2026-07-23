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
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BookOpen,
  Braces,
  Code2,
  Link2,
  MessagesSquare,
  Rocket,
  Search,
  Terminal,
  Wrench,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useDeferredValue, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { GUIDE_GROUPS, guideSummary, guideTitle } from './docs-copy'
import type { DocsGuide } from './types'

const GROUP_ICONS = [Rocket, Terminal, MessagesSquare, Code2, Wrench]

export function DocsHome(props: { guides: DocsGuide[] }) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search.trim().toLocaleLowerCase())
  const filteredGuides = useMemo(() => {
    if (!deferredSearch) return props.guides
    return props.guides.filter((guide) => {
      const searchText = `${guideTitle(t, guide)} ${guideSummary(t, guide)}`
      return searchText.toLocaleLowerCase().includes(deferredSearch)
    })
  }, [deferredSearch, props.guides, t])

  return (
    <div className='pb-16'>
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className='border-border/60 relative overflow-hidden rounded-2xl border bg-[radial-gradient(circle_at_85%_10%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_36%)] px-6 py-10 sm:px-10 sm:py-14'
      >
        <div className='max-w-3xl'>
          <p className='text-primary mb-3 text-xs font-semibold tracking-widest uppercase'>
            {t('docs.hero.eyebrow')}
          </p>
          <h1 className='text-4xl leading-tight font-semibold tracking-[-0.035em] sm:text-5xl'>
            {t('docs.hero.title')}
          </h1>
          <p className='text-muted-foreground mt-4 max-w-2xl text-base leading-7 sm:text-lg'>
            {t('docs.hero.description')}
          </p>
          <div className='mt-7 flex flex-wrap gap-3'>
            <Button
              render={
                <Link
                  to='/docs/guides/$slug'
                  params={{ slug: 'quick-start' }}
                />
              }
            >
              <Rocket className='size-4' />
              {t('docs.actions.quickStart')}
            </Button>
            <Button variant='outline' render={<Link to='/docs/api' />}>
              <Braces className='size-4' />
              {t('docs.actions.apiReference')}
            </Button>
          </div>
        </div>
      </motion.section>

      <div className='relative mt-8'>
        <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2' />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('docs.search.placeholder')}
          aria-label={t('docs.search.label')}
          className='h-11 rounded-xl pl-10'
        />
      </div>

      <div className='mt-10 space-y-12'>
        {GUIDE_GROUPS.map((group, groupIndex) => {
          const GroupIcon = GROUP_ICONS[groupIndex]
          const items = filteredGuides.filter(
            (guide) => guide.group === group.source
          )
          if (items.length === 0) return null

          return (
            <motion.section
              key={group.source}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                <GroupIcon className='text-primary size-4.5' />
                {t(group.labelKey)}
              </h2>
              <div className='grid gap-3 md:grid-cols-2'>
                {items.map((guide, itemIndex) => (
                  <motion.div
                    key={guide.route}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.32,
                      delay: reduceMotion ? 0 : itemIndex * 0.04,
                    }}
                  >
                    <Link
                      to={guide.route}
                      className='border-border/60 bg-card hover:border-primary/30 hover:bg-accent/35 group flex h-full min-h-32 flex-col rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm'
                    >
                      <div className='flex items-start justify-between gap-4'>
                        <h3 className='font-semibold tracking-tight'>
                          {guideTitle(t, guide)}
                        </h3>
                        <ArrowRight className='text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5' />
                      </div>
                      <p className='text-muted-foreground mt-2 text-sm leading-6'>
                        {guideSummary(t, guide)}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )
        })}
      </div>

      {filteredGuides.length === 0 && (
        <div className='border-border/60 mt-10 rounded-xl border border-dashed px-6 py-14 text-center'>
          <BookOpen className='text-muted-foreground mx-auto size-7' />
          <p className='mt-3 font-medium'>{t('docs.search.emptyTitle')}</p>
          <p className='text-muted-foreground mt-1 text-sm'>
            {t('docs.search.emptyDescription')}
          </p>
        </div>
      )}

      <section className='border-border/60 bg-muted/25 mt-12 flex flex-col gap-5 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-start gap-3'>
          <div className='bg-background border-border/60 flex size-9 shrink-0 items-center justify-center rounded-lg border'>
            <Link2 className='size-4' />
          </div>
          <div>
            <h2 className='font-semibold'>{t('docs.aiReadable.title')}</h2>
            <p className='text-muted-foreground mt-1 text-sm leading-6'>
              {t('docs.aiReadable.description')}
            </p>
          </div>
        </div>
        <Button
          variant='outline'
          render={<a href='/docs/reference/llms-full.txt' target='_blank' />}
          className='shrink-0'
        >
          {t('docs.aiReadable.open')}
          <ArrowRight className='size-4' />
        </Button>
      </section>
    </div>
  )
}
