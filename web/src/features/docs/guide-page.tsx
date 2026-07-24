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
/* oxlint-disable react/no-danger -- bundled documentation HTML is sanitized with DOMPurify before rendering. */
import { Link, useNavigate } from '@tanstack/react-router'
import DOMPurify from 'dompurify'
import { ArrowLeft, ArrowRight, Copy, FileText } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

import { guideSummary, guideTitle } from './docs-copy'
import { DocsTokenInjection } from './docs-token-injection'
import {
  getDocsTokenForUser,
  injectDocsToken,
  useDocsTokenStore,
} from './docs-token-store'
import type { DocsGuide } from './types'

export function GuidePage(props: {
  guide?: DocsGuide
  guides: DocsGuide[]
  apiBase: string
}) {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const userId = useAuthStore((state) => state.auth.user?.id)
  const token = useDocsTokenStore((state) => getDocsTokenForUser(state, userId))
  const currentIndex = useMemo(
    () => props.guides.findIndex((guide) => guide.route === props.guide?.route),
    [props.guide?.route, props.guides]
  )
  const previousGuide = currentIndex > 0 ? props.guides[currentIndex - 1] : null
  const nextGuide =
    currentIndex >= 0 && currentIndex < props.guides.length - 1
      ? props.guides[currentIndex + 1]
      : null

  if (!props.guide) {
    return (
      <div className='border-border/60 rounded-2xl border border-dashed px-6 py-16 text-center'>
        <FileText className='text-muted-foreground mx-auto size-8' />
        <h1 className='mt-4 text-xl font-semibold'>
          {t('docs.guide.notFoundTitle')}
        </h1>
        <p className='text-muted-foreground mt-2 text-sm'>
          {t('docs.guide.notFoundDescription')}
        </p>
        <Button className='mt-6' render={<Link to='/docs' />}>
          {t('docs.guide.backHome')}
        </Button>
      </div>
    )
  }

  const guide = props.guide
  const injectedHtml = injectDocsToken(guide.html, token)
  const safeHtml = DOMPurify.sanitize(injectedHtml)
  const isChinese = i18n.language.startsWith('zh')

  const copyGuide = async () => {
    const parser = new DOMParser()
    const article = parser.parseFromString(injectedHtml, 'text/html')
    await navigator.clipboard.writeText(
      `# ${guideTitle(t, guide)}\n\n${guideSummary(t, guide)}\n\n${article.body.innerText}`
    )
    toast.success(t('docs.guide.copied'))
  }

  const handleArticleClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement
    const anchor = target.closest('a')
    const href = anchor?.getAttribute('href')
    if (!href?.startsWith('/docs/')) return
    event.preventDefault()
    navigate({ to: href })
  }

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className='mx-auto max-w-3xl pb-16'
    >
      <div className='mb-8 flex items-center justify-between gap-4'>
        <Button variant='ghost' size='sm' render={<Link to='/docs' />}>
          <ArrowLeft className='size-4' />
          {t('docs.guide.allGuides')}
        </Button>
        <Button variant='outline' size='sm' onClick={copyGuide}>
          <Copy className='size-4' />
          {t('docs.guide.copy')}
        </Button>
      </div>

      <header className='border-border/60 border-b pb-8'>
        <p className='text-primary text-xs font-semibold tracking-widest uppercase'>
          {t('docs.guide.eyebrow')}
        </p>
        <h1 className='mt-3 text-3xl leading-tight font-semibold tracking-[-0.025em] sm:text-4xl'>
          {guideTitle(t, guide)}
        </h1>
        <p className='text-muted-foreground mt-4 text-base leading-7'>
          {guideSummary(t, guide)}
        </p>
      </header>

      <DocsTokenInjection />

      {isChinese ? (
        <section
          onClick={handleArticleClick}
          className='prose-docs [&_a]:text-primary [&_blockquote]:border-primary/40 [&_blockquote]:bg-muted/30 [&_blockquote]:text-muted-foreground [&_code]:bg-muted [&_p]:text-muted-foreground [&_pre]:border-border/70 [&_pre]:bg-muted/45 [&_pre_code]:text-foreground [&_strong]:text-foreground mt-9 text-[15px] leading-7 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.88em] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_li]:my-1.5 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:p-5 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6'
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      ) : (
        <section className='mt-9 space-y-8 text-[15px] leading-7'>
          <div>
            <h2 className='text-xl font-semibold'>
              {t('docs.guide.localizedOverview')}
            </h2>
            <p className='text-muted-foreground mt-3'>
              {t('docs.guide.localizedDescription')}
            </p>
          </div>
          <ol className='space-y-4'>
            {[
              t('docs.guide.stepToken'),
              t('docs.guide.stepBaseUrl', { apiBase: props.apiBase }),
              t('docs.guide.stepModel'),
              t('docs.guide.stepVerify'),
            ].map((step, index) => (
              <li key={step} className='flex gap-4'>
                <span className='bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
                  {index + 1}
                </span>
                <span className='text-muted-foreground'>{step}</span>
              </li>
            ))}
          </ol>
          <pre className='border-border/70 bg-muted/45 overflow-x-auto rounded-xl border p-5 text-xs leading-6'>
            <code>
              {injectDocsToken(
                `curl ${props.apiBase}/v1/models \\\n  -H "Authorization: Bearer $NEW_API_KEY"`,
                token
              )}
            </code>
          </pre>
          <details className='border-border/60 rounded-xl border'>
            <summary className='cursor-pointer px-5 py-4 text-sm font-medium'>
              {t('docs.guide.originalContent')}
            </summary>
            <div className='border-border/60 border-t px-5 py-4'>
              <p className='text-muted-foreground mb-5 text-sm'>
                {t('docs.guide.originalDescription')}
              </p>
              <section
                onClick={handleArticleClick}
                className='prose-docs [&_a]:text-primary [&_p]:text-muted-foreground [&_pre]:bg-muted/45 text-[15px] leading-7 [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_p]:my-3 [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4'
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            </div>
          </details>
        </section>
      )}

      <nav className='border-border/60 mt-12 grid gap-3 border-t pt-7 sm:grid-cols-2'>
        {previousGuide ? (
          <Link
            to={previousGuide.route}
            className='border-border/60 hover:bg-accent/40 rounded-xl border p-4 transition-colors'
          >
            <span className='text-muted-foreground flex items-center gap-1 text-xs'>
              <ArrowLeft className='size-3.5' />
              {t('docs.guide.previous')}
            </span>
            <strong className='mt-2 block text-sm'>
              {guideTitle(t, previousGuide)}
            </strong>
          </Link>
        ) : (
          <span />
        )}
        {nextGuide && (
          <Link
            to={nextGuide.route}
            className='border-border/60 hover:bg-accent/40 rounded-xl border p-4 text-right transition-colors'
          >
            <span className='text-muted-foreground flex items-center justify-end gap-1 text-xs'>
              {t('docs.guide.next')}
              <ArrowRight className='size-3.5' />
            </span>
            <strong className='mt-2 block text-sm'>
              {guideTitle(t, nextGuide)}
            </strong>
          </Link>
        )}
      </nav>
    </motion.article>
  )
}
