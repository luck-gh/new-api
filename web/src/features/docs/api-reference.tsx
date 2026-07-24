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
import { Check, Copy, Search } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { endpointTitle } from './docs-copy'
import { DocsTokenInjection } from './docs-token-injection'
import {
  getDocsTokenForUser,
  injectDocsToken,
  useDocsTokenStore,
} from './docs-token-store'
import type { DocsEndpoint } from './types'

const LANGUAGES = ['cURL', 'JavaScript', 'Python', 'Go'] as const
type CodeLanguage = (typeof LANGUAGES)[number]

function requestCode(
  language: CodeLanguage,
  endpoint: DocsEndpoint,
  apiBase: string,
  token: string
) {
  const url = `${apiBase}${endpoint.path}`
  if (language === 'JavaScript') {
    return injectDocsToken(
      `const response = await fetch('${url}', {\n  method: '${endpoint.method}',\n  headers: {\n    Authorization: 'Bearer $NEW_API_KEY',\n    'Content-Type': 'application/json',\n  },\n});\n\nconst data = await response.json();`,
      token
    )
  }
  if (language === 'Python') {
    return injectDocsToken(
      `import requests\n\nresponse = requests.${endpoint.method.toLowerCase()}(\n    '${url}',\n    headers={'Authorization': 'Bearer $NEW_API_KEY'},\n)\n\nprint(response.json())`,
      token
    )
  }
  if (language === 'Go') {
    return injectDocsToken(
      `req, _ := http.NewRequest("${endpoint.method}", "${url}", nil)\nreq.Header.Set("Authorization", "Bearer $NEW_API_KEY")\nresp, err := http.DefaultClient.Do(req)`,
      token
    )
  }
  return injectDocsToken(endpoint.requestExample, token)
}

function CodePanel(props: { label: string; code: string }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(props.code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <section className='border-border/60 overflow-hidden rounded-xl border'>
      <header className='bg-muted/40 border-border/60 flex h-10 items-center justify-between border-b px-3'>
        <span className='text-muted-foreground text-xs font-medium'>
          {props.label}
        </span>
        <Button
          variant='ghost'
          size='icon-sm'
          onClick={copy}
          aria-label={t('docs.api.copyCode')}
        >
          {copied ? (
            <Check className='size-3.5' />
          ) : (
            <Copy className='size-3.5' />
          )}
        </Button>
      </header>
      <pre className='bg-card max-h-[30rem] overflow-auto p-4 text-xs leading-6'>
        <code>{props.code}</code>
      </pre>
    </section>
  )
}

export function ApiReference(props: {
  endpoints: DocsEndpoint[]
  apiBase: string
}) {
  const { i18n, t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const userId = useAuthStore((state) => state.auth.user?.id)
  const token = useDocsTokenStore((state) => getDocsTokenForUser(state, userId))
  const isChinese = i18n.language.startsWith('zh')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState('endpoint-2')
  const [language, setLanguage] = useState<CodeLanguage>('cURL')
  const [status, setStatus] = useState('200')
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    if (!query) return props.endpoints
    return props.endpoints.filter((endpoint) =>
      `${endpointTitle(t, endpoint)} ${endpoint.method} ${endpoint.path}`
        .toLocaleLowerCase()
        .includes(query)
    )
  }, [props.endpoints, search, t])
  const selected =
    props.endpoints.find((endpoint) => endpoint.id === selectedId) ||
    props.endpoints[0]

  useEffect(() => {
    if (!selected) return
    setLanguage('cURL')
    setStatus(selected.statuses[0] || '200')
  }, [selected])

  if (!selected) {
    return (
      <div className='border-border/60 rounded-xl border border-dashed py-14 text-center text-sm'>
        {t('docs.api.empty')}
      </div>
    )
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className='pb-16'
    >
      <header className='mb-8'>
        <p className='text-primary text-xs font-semibold tracking-widest uppercase'>
          {t('docs.api.eyebrow')}
        </p>
        <h1 className='mt-3 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl'>
          {t('docs.api.title')}
        </h1>
        <p className='text-muted-foreground mt-3 max-w-2xl text-base leading-7'>
          {t('docs.api.description')}
        </p>
      </header>

      <DocsTokenInjection />

      <div className='mb-5 md:hidden'>
        <label className='text-muted-foreground mb-2 block text-xs font-medium'>
          {t('docs.api.selectEndpoint')}
        </label>
        <select
          value={selected.id}
          onChange={(event) => setSelectedId(event.target.value)}
          className='border-input bg-background focus:ring-ring h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2'
        >
          {props.endpoints.map((endpoint) => (
            <option key={endpoint.id} value={endpoint.id}>
              {endpoint.method} · {endpointTitle(t, endpoint)}
            </option>
          ))}
        </select>
      </div>

      <div className='grid gap-8 md:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_21rem]'>
        <aside className='hidden md:block'>
          <div className='sticky top-20'>
            <div className='relative mb-3'>
              <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2' />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('docs.api.search')}
                className='h-9 pl-9 text-xs'
              />
            </div>
            <div className='max-h-[calc(100svh-9rem)] space-y-1 overflow-y-auto pr-1'>
              {filtered.map((endpoint) => (
                <button
                  key={endpoint.id}
                  type='button'
                  onClick={() => setSelectedId(endpoint.id)}
                  className={cn(
                    'w-full rounded-lg px-3 py-2.5 text-left transition-colors',
                    selected.id === endpoint.id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-primary font-mono text-[10px] font-semibold'>
                      {endpoint.method}
                    </span>
                    <span className='truncate text-xs font-medium'>
                      {endpointTitle(t, endpoint)}
                    </span>
                  </span>
                  <code className='mt-1 block truncate text-[10px] opacity-65'>
                    {endpoint.path}
                  </code>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='bg-primary/10 text-primary rounded-md px-2 py-1 font-mono text-xs font-semibold'>
              {selected.method}
            </span>
            <code className='text-muted-foreground text-sm'>
              {selected.path}
            </code>
          </div>
          <h2 className='mt-4 text-2xl font-semibold tracking-tight'>
            {endpointTitle(t, selected)}
          </h2>
          <p className='text-muted-foreground mt-3 text-sm leading-7'>
            {isChinese
              ? selected.description
              : t('docs.api.endpointDescription', {
                  method: selected.method,
                  path: selected.path,
                })}
          </p>

          <section className='border-border/60 mt-7 rounded-xl border p-5'>
            <p className='text-muted-foreground text-xs font-medium'>
              {t('docs.api.baseUrl')}
            </p>
            <code className='mt-2 block text-sm font-semibold break-all'>
              {props.apiBase}
            </code>
          </section>

          <section className='mt-9'>
            <h3 className='text-lg font-semibold'>{t('docs.api.details')}</h3>
            {isChinese ? (
              <div className='text-muted-foreground mt-3 text-sm leading-7 whitespace-pre-line'>
                {selected.details}
              </div>
            ) : (
              <div className='text-muted-foreground mt-3 space-y-3 text-sm leading-7'>
                <p>{t('docs.api.endpointAuth')}</p>
                <p>{t('docs.api.endpointRouting')}</p>
                <p>{t('docs.api.endpointResponse')}</p>
              </div>
            )}
          </section>

          <section className='mt-9 xl:hidden'>
            <div className='bg-muted mb-3 flex flex-wrap gap-1 rounded-lg p-1'>
              {LANGUAGES.map((item) => (
                <button
                  key={item}
                  type='button'
                  onClick={() => setLanguage(item)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                    language === item
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <CodePanel
              label={t('docs.api.requestExample')}
              code={requestCode(language, selected, props.apiBase, token)}
            />
          </section>
        </main>

        <aside className='hidden xl:block'>
          <div className='sticky top-20 space-y-4'>
            <div className='bg-muted flex flex-wrap gap-1 rounded-lg p-1'>
              {LANGUAGES.map((item) => (
                <button
                  key={item}
                  type='button'
                  onClick={() => setLanguage(item)}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors',
                    language === item
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <CodePanel
              label={t('docs.api.requestExample')}
              code={requestCode(language, selected, props.apiBase, token)}
            />
            <section>
              <div className='mb-2 flex flex-wrap gap-1'>
                {selected.statuses.map((item) => (
                  <button
                    key={item}
                    type='button'
                    onClick={() => setStatus(item)}
                    className={cn(
                      'rounded-md px-2 py-1 text-[11px] font-medium',
                      status === item
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <CodePanel
                label={`${t('docs.api.responseExample')} · ${status}`}
                code={selected.responseExample}
              />
            </section>
          </div>
        </aside>
      </div>
    </motion.div>
  )
}
