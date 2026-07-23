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
  Boxes,
  Check,
  Copy,
  ExternalLink,
  Gauge,
  LayoutDashboard,
  LifeBuoy,
  Network,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'

type Feature = {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export function DefaultAboutPage() {
  const { t } = useTranslation()
  const { systemName, logo } = useSystemConfig()
  const { status } = useStatus()
  const [copied, setCopied] = useState(false)
  const currentYear = new Date().getFullYear()
  const baseUrl = useMemo(() => {
    const configured = status?.server_address
    if (typeof configured === 'string' && configured.trim()) {
      return configured.replace(/\/$/, '')
    }
    return typeof window === 'undefined' ? '' : window.location.origin
  }, [status?.server_address])

  const features: Feature[] = [
    {
      title: t('about.default.features.gateway.title', {
        defaultValue: '统一 API 网关',
      }),
      description: t('about.default.features.gateway.description', {
        defaultValue:
          '通过统一协议接入多种模型与上游渠道，降低应用切换和维护成本。',
      }),
      icon: Network,
    },
    {
      title: t('about.default.features.transparent.title', {
        defaultValue: '能力与渠道透明',
      }),
      description: t('about.default.features.transparent.description', {
        defaultValue:
          '模型能力、接口路径与使用方式以站内文档和控制台配置为准。',
      }),
      icon: Gauge,
    },
    {
      title: t('about.default.features.support.title', {
        defaultValue: '务实的服务支持',
      }),
      description: t('about.default.features.support.description', {
        defaultValue:
          '遇到调用问题时，可结合请求日志、错误信息和站点公告快速排查。',
      }),
      icon: ShieldCheck,
    },
  ]

  const copyBaseUrl = async () => {
    await navigator.clipboard.writeText(baseUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <PublicLayout showMainContainer={false}>
      <main className='mx-auto w-full max-w-6xl px-4 pt-24 pb-16 sm:px-6'>
        <section className='border-border/70 bg-muted/20 grid border lg:grid-cols-[minmax(0,1fr)_24rem]'>
          <div className='px-6 py-8 sm:px-10 sm:py-10'>
            <div className='mb-7 flex items-center gap-3'>
              <div className='border-border bg-background flex size-12 items-center justify-center border'>
                <img
                  src={logo}
                  alt={systemName}
                  className='size-9 object-contain'
                />
              </div>
              <span className='border-border bg-background border px-3 py-1 font-mono text-xs font-semibold tracking-wide'>
                gateway
              </span>
            </div>

            <h1 className='text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl'>
              {t('about.default.hero.title', {
                defaultValue: '{{siteName}} 服务站',
                siteName: systemName,
              })}
            </h1>
            <p className='text-muted-foreground mt-5 max-w-2xl text-base leading-8 sm:text-lg'>
              {t('about.default.hero.description', {
                defaultValue:
                  '{{siteName}} 提供统一、稳定且易于接入的 AI API 服务，帮助开发者用一致的接口连接不同模型能力。',
                siteName: systemName,
              })}
            </p>

            <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
              <Button render={<a href='/docs/' />} className='rounded-none'>
                <BookOpen className='size-4' />
                {t('Docs')}
              </Button>
              <Button
                variant='outline'
                render={<Link to='/dashboard' />}
                className='rounded-none'
              >
                <LayoutDashboard className='size-4' />
                {t('Console')}
              </Button>
            </div>
          </div>

          <aside className='border-border/70 grid border-t px-6 py-7 lg:border-t-0 lg:border-l lg:px-8'>
            <div className='flex items-start gap-3 border-b pb-5'>
              <div className='bg-muted flex size-8 shrink-0 items-center justify-center'>
                <Boxes className='size-4' />
              </div>
              <div>
                <h2 className='text-sm font-semibold'>
                  {t('about.default.profile.title', {
                    defaultValue: '站点定位',
                  })}
                </h2>
                <p className='text-muted-foreground mt-1 text-sm'>
                  {t('about.default.profile.value', {
                    defaultValue: '统一 AI API 服务',
                  })}
                </p>
              </div>
            </div>
            <Fact
              label={t('about.default.profile.protocol', {
                defaultValue: '兼容协议',
              })}
              value='OpenAI · Claude · Gemini'
            />
            <Fact
              label={t('about.default.profile.address', {
                defaultValue: 'API 地址',
              })}
              value={baseUrl}
              mono
            />
            <Fact
              label={t('about.default.profile.docs', {
                defaultValue: '使用文档',
              })}
              value='/docs'
              mono
              last
            />
          </aside>
        </section>

        <section className='mt-12 grid border-y lg:grid-cols-3'>
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`py-7 lg:px-7 ${index > 0 ? 'border-t lg:border-t-0 lg:border-l' : ''}`}
            >
              <div className='bg-muted mb-4 flex size-8 items-center justify-center'>
                <feature.icon className='size-4' />
              </div>
              <h2 className='text-sm font-semibold'>{feature.title}</h2>
              <p className='text-muted-foreground mt-2 text-sm leading-6'>
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <section className='mt-10 grid border-b pb-10 lg:grid-cols-[minmax(0,1fr)_24rem]'>
          <div className='pb-8 lg:pr-10 lg:pb-0'>
            <SectionTitle
              icon={Sparkles}
              title={t('about.default.usage.title', {
                defaultValue: '接入说明',
              })}
              description={t('about.default.usage.description', {
                defaultValue: '使用站点令牌和当前 API 地址即可开始调用。',
              })}
            />
            <ul className='mt-6 grid gap-4 text-sm leading-6 sm:grid-cols-2'>
              <li>
                {t('about.default.usage.item1', {
                  defaultValue: '在控制台创建并妥善保管 API 令牌。',
                })}
              </li>
              <li>
                {t('about.default.usage.item2', {
                  defaultValue: '模型可用性与计费规则以控制台展示为准。',
                })}
              </li>
              <li>
                {t('about.default.usage.item3', {
                  defaultValue: '客户端 Base URL 使用本站 API 地址。',
                })}
              </li>
              <li>
                {t('about.default.usage.item4', {
                  defaultValue: '排障时请保留请求时间、模型名和错误信息。',
                })}
              </li>
            </ul>
          </div>

          <div className='border-t pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8'>
            <SectionTitle
              icon={LifeBuoy}
              title={t('about.default.support.title', {
                defaultValue: '快速接入',
              })}
              description={t('about.default.support.description', {
                defaultValue: '复制 API 地址，或进入文档查看完整示例。',
              })}
            />
            <div className='bg-muted/60 mt-6 border p-4'>
              <span className='text-muted-foreground text-xs'>Base URL</span>
              <code className='mt-2 block text-sm font-semibold break-all'>
                {baseUrl}
              </code>
            </div>
            <Button
              variant='secondary'
              className='mt-3 w-full rounded-none'
              onClick={copyBaseUrl}
            >
              {copied ? (
                <Check className='size-4' />
              ) : (
                <Copy className='size-4' />
              )}
              {copied
                ? t('Copied')
                : t('about.default.support.copy', {
                    defaultValue: '复制 API 地址',
                  })}
            </Button>
          </div>
        </section>

        <section className='mt-10 grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]'>
          <SectionTitle
            icon={Scale}
            title={t('about.default.opensource.title', {
              defaultValue: '开源声明',
            })}
            description={t('about.default.opensource.subtitle', {
              defaultValue: '开源基座',
            })}
          />
          <div className='text-muted-foreground space-y-3 text-sm leading-6'>
            <p>
              {t('New API Project Repository:')}{' '}
              <LicenseLink href='https://github.com/QuantumNous/new-api'>
                new-api
              </LicenseLink>
            </p>
            <p>
              {t('This project must be used in compliance with the')}{' '}
              <LicenseLink href='https://github.com/QuantumNous/new-api/blob/main/LICENSE'>
                GNU AGPL v3
              </LicenseLink>
              .
            </p>
            <p>
              <LicenseLink href='https://github.com/QuantumNous/new-api'>
                new-api
              </LicenseLink>{' '}
              © {currentYear}{' '}
              <LicenseLink href='https://github.com/QuantumNous'>
                QuantumNous
              </LicenseLink>{' '}
              {t('| Based on')}{' '}
              <LicenseLink href='https://github.com/songquanpeng/one-api'>
                One API
              </LicenseLink>{' '}
              © 2023{' '}
              <LicenseLink href='https://github.com/songquanpeng'>
                JustSong
              </LicenseLink>
            </p>
          </div>
        </section>
      </main>
    </PublicLayout>
  )
}

function Fact(props: {
  label: string
  value: string
  mono?: boolean
  last?: boolean
}) {
  return (
    <div className={`py-4 ${props.last ? '' : 'border-b'}`}>
      <span className='text-muted-foreground text-xs'>{props.label}</span>
      <strong
        className={`mt-1 block truncate text-sm ${props.mono ? 'font-mono' : ''}`}
        title={props.value}
      >
        {props.value}
      </strong>
    </div>
  )
}

function SectionTitle(props: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className='flex items-start gap-3'>
      <div className='bg-muted flex size-8 shrink-0 items-center justify-center'>
        <props.icon className='size-4' />
      </div>
      <div>
        <h2 className='text-lg font-semibold'>{props.title}</h2>
        <p className='text-muted-foreground mt-1 text-sm'>
          {props.description}
        </p>
      </div>
    </div>
  )
}

function LicenseLink(props: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={props.href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-foreground decoration-border hover:decoration-foreground inline-flex items-center gap-1 underline underline-offset-4'
    >
      {props.children}
      <ExternalLink className='size-3' aria-hidden='true' />
    </a>
  )
}
