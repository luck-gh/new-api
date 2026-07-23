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
import { ArrowRight, BookOpen, Check, Copy, KeyRound } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

type SourceHomeHeroProps = {
  apiBase: string
  isAuthenticated: boolean
  logo: string
  onCopyApiBase: () => void
  systemName: string
}

const CODE_LINES = [
  'const client = new OpenAI({ baseURL: API_BASE })',
  'Authorization: Bearer $NEW_API_KEY',
  'POST /v1/chat/completions',
  'model: "gpt-4o-mini"',
  'stream: true',
  'GET /v1/models',
]

export function SourceHomeHero(props: SourceHomeHeroProps) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const actionUrl = props.isAuthenticated ? '/dashboard' : '/sign-up'
  const actionLabel = props.isAuthenticated
    ? t('Go to Dashboard')
    : t('home.brand.getKey', { defaultValue: '立即获取密钥' })

  return (
    <section className='border-border/40 relative min-h-[720px] overflow-hidden border-b bg-[#f5f5f3] pt-24 text-[#161616] transition-colors duration-700 md:min-h-[760px] md:pt-28 dark:bg-[#151515] dark:text-white'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 overflow-hidden'
      >
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_68%_38%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_36%)]' />
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -22, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 18, ease: 'easeInOut', repeat: Infinity }
          }
          className='absolute inset-x-0 top-0 grid rotate-[-2deg] grid-cols-2 gap-x-16 gap-y-2 px-4 py-8 font-mono text-[9px] leading-5 text-black/[0.055] sm:grid-cols-3 md:text-[10px] dark:text-white/[0.055]'
        >
          {Array.from({ length: 36 }, (_, index) => (
            <span key={index} className='truncate'>
              {CODE_LINES[index % CODE_LINES.length]}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className='relative mx-auto flex min-h-[620px] max-w-7xl flex-col px-5 pb-12 sm:px-8 md:px-10'
      >
        <div className='mb-auto flex flex-col items-start gap-3 pt-3 sm:flex-row sm:items-center'>
          <div className='border-border/60 bg-background/55 text-muted-foreground flex items-center gap-2 border px-3 py-2 text-[11px] backdrop-blur-sm'>
            <span className='bg-primary size-1.5 rounded-full' />
            {t('home.brand.globalEndpoint', {
              defaultValue: '统一 API 接入节点',
            })}
          </div>
          <div className='border-border/60 bg-background/55 flex min-w-0 items-center gap-2 border px-3 py-2 font-mono text-[11px] backdrop-blur-sm'>
            <code className='max-w-[15rem] truncate sm:max-w-sm'>
              {props.apiBase}
            </code>
            <button
              type='button'
              onClick={props.onCopyApiBase}
              className='text-muted-foreground hover:text-foreground transition-colors'
              aria-label={t('Copy API address')}
            >
              <Copy className='size-3.5' />
            </button>
          </div>
          <code className='text-muted-foreground/60 px-1 py-2 text-[11px]'>
            /v1/
          </code>
        </div>

        <div className='grid items-end gap-10 pb-6 md:grid-cols-[1.45fr_1fr] md:gap-16'>
          <div>
            <div className='mb-5 flex items-center gap-4'>
              <img
                src={props.logo}
                alt={props.systemName}
                className='size-14 rounded-xl object-contain sm:size-16'
              />
              <div className='bg-foreground/20 h-px w-14' />
            </div>
            <h1 className='text-foreground max-w-[50rem] text-[clamp(3rem,7vw,6.25rem)] leading-[0.9] font-semibold tracking-[-0.045em]'>
              <span className='block'>{props.systemName}</span>
              <span className='mt-2 block opacity-90'>
                {t('home.brand.heroTagline', {
                  defaultValue: '智能基座，一站百通',
                })}
              </span>
            </h1>
          </div>

          <div className='text-foreground pb-2'>
            <p className='text-xl leading-tight font-semibold text-balance sm:text-2xl'>
              {t('home.brand.heroPitch', {
                defaultValue: '统一模型 API。兼容主流协议，只需更改基础 URL。',
              })}
            </p>
            <div className='text-muted-foreground mt-4 space-y-2 text-sm'>
              {[
                t('home.brand.heroPointProtocol', {
                  defaultValue: 'OpenAI 兼容调用方式',
                }),
                t('home.brand.heroPointModels', {
                  defaultValue: '一个令牌访问已配置模型',
                }),
                t('home.brand.heroPointObserve', {
                  defaultValue: '统一查看用量、额度与调用记录',
                }),
              ].map((item) => (
                <div key={item} className='flex items-center gap-2'>
                  <Check className='text-primary size-3.5' />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className='mt-7 flex flex-wrap gap-3'>
              <Button
                className='bg-foreground text-background hover:bg-foreground/90 h-11 rounded-none px-5 text-xs font-semibold'
                render={<Link to={actionUrl} />}
              >
                <KeyRound className='size-4' />
                {actionLabel}
                <ArrowRight className='size-4' />
              </Button>
              <Button
                variant='outline'
                className='border-border/80 bg-background/30 text-foreground hover:bg-accent h-11 rounded-none px-5 text-xs'
                render={<Link to='/docs' />}
              >
                <BookOpen className='size-4' />
                {t('Docs')}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
