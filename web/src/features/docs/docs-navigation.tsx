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
  BookOpen,
  Braces,
  Code2,
  Menu,
  MessagesSquare,
  Rocket,
  Terminal,
  Wrench,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { GUIDE_GROUPS, guideSlug, guideTitle } from './docs-copy'
import type { DocsGuide } from './types'

const GROUP_ICONS = [Rocket, Terminal, MessagesSquare, Code2, Wrench]

type DocsNavigationProps = {
  guides: DocsGuide[]
  pathname: string
  onNavigate?: () => void
}

function NavigationContent(props: DocsNavigationProps) {
  const { t } = useTranslation()

  return (
    <nav aria-label={t('docs.navigation.label')} className='space-y-6'>
      <div className='space-y-1'>
        <Link
          to='/docs'
          onClick={props.onNavigate}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            props.pathname === '/docs' || props.pathname === '/docs/'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
          )}
        >
          <BookOpen className='size-4' />
          {t('docs.navigation.home')}
        </Link>
        <Link
          to='/docs/api'
          onClick={props.onNavigate}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            props.pathname === '/docs/api'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
          )}
        >
          <Braces className='size-4' />
          {t('docs.navigation.api')}
        </Link>
      </div>

      {GUIDE_GROUPS.map((group, groupIndex) => {
        const GroupIcon = GROUP_ICONS[groupIndex]
        const items = props.guides.filter(
          (guide) => guide.group === group.source
        )
        if (items.length === 0) return null

        return (
          <section key={group.source}>
            <h2 className='text-muted-foreground mb-2 flex items-center gap-2 px-3 text-xs font-semibold tracking-wide uppercase'>
              <GroupIcon className='size-3.5' />
              {t(group.labelKey)}
            </h2>
            <div className='space-y-0.5'>
              {items.map((guide) => (
                <Link
                  key={guide.route}
                  to={guide.route}
                  onClick={props.onNavigate}
                  className={cn(
                    'block rounded-lg px-3 py-2 text-sm leading-5 transition-colors',
                    props.pathname === guide.route
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                  )}
                >
                  {guideTitle(t, guide)}
                  {guideSlug(guide) === 'cc-switch' && (
                    <span className='bg-primary/10 text-primary ms-2 rounded px-1.5 py-0.5 text-[10px] font-semibold'>
                      {t('docs.recommended')}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </nav>
  )
}

export function DesktopDocsNavigation(props: DocsNavigationProps) {
  return (
    <aside className='border-border/60 sticky top-20 hidden h-[calc(100svh-6rem)] overflow-y-auto border-r pr-5 pb-8 lg:block'>
      <NavigationContent {...props} />
    </aside>
  )
}

export function MobileDocsNavigation(props: DocsNavigationProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant='outline'
            size='sm'
            className='rounded-lg lg:hidden'
          />
        }
      >
        <Menu className='size-4' />
        {t('docs.navigation.contents')}
      </SheetTrigger>
      <SheetContent side='left' className='w-[19rem] sm:max-w-[19rem]'>
        <SheetHeader className='border-b px-5 py-5'>
          <SheetTitle>{t('docs.title')}</SheetTitle>
          <SheetDescription>
            {t('docs.navigation.description')}
          </SheetDescription>
        </SheetHeader>
        <div className='min-h-0 flex-1 overflow-y-auto px-3 py-5'>
          <NavigationContent {...props} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
