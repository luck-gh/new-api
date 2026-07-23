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
import {
  Activity,
  ArrowRight,
  Gauge,
  Route,
  Scale,
  Send,
  ServerCog,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'

type SourceHomePolicyAndRequestProps = {
  logo: string
  systemName: string
}

export function SourceHomePolicyAndRequest(
  props: SourceHomePolicyAndRequestProps
) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const policies = [
    {
      icon: Gauge,
      title: t('home.brand.capacityTitle', { defaultValue: '容量保护' }),
      lead: t('home.brand.capacityLead', {
        defaultValue: '在系统负载升高时优先保护稳定性。',
      }),
      items: [
        t('home.brand.capacityPointOne', {
          defaultValue: '通过限流、排队和渠道权重控制请求压力。',
        }),
        t('home.brand.capacityPointTwo', {
          defaultValue: '异常状态和恢复进度通过公告说明。',
        }),
      ],
    },
    {
      icon: Scale,
      title: t('home.brand.fairUseTitle', {
        defaultValue: '合理使用规则',
      }),
      lead: t('home.brand.fairUseLead', {
        defaultValue: '调用边界以令牌权限、模型策略和站点规则为准。',
      }),
      items: [
        t('home.brand.fairUsePointOne', {
          defaultValue: '正常客户端、SDK 与编程工具调用均按配置开放。',
        }),
        t('home.brand.fairUsePointTwo', {
          defaultValue: '自动化高并发需要遵守站点并发与频率限制。',
        }),
      ],
    },
    {
      icon: ServerCog,
      title: t('home.brand.incidentTitle', {
        defaultValue: '服务异常处理',
      }),
      lead: t('home.brand.incidentLead', {
        defaultValue: '区分上游、网络与本站服务问题，给出可追踪结果。',
      }),
      items: [
        t('home.brand.incidentPointOne', {
          defaultValue: '保留请求时间、端点和错误信息有助于快速定位。',
        }),
        t('home.brand.incidentPointTwo', {
          defaultValue: '补偿或处理方式以运营方公开规则为准。',
        }),
      ],
    },
  ]

  return (
    <>
      <section className='bg-background text-foreground px-5 py-20 transition-colors duration-700 sm:px-8 md:py-28'>
        <div className='mx-auto max-w-7xl'>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className='mb-10'
          >
            <h2 className='text-3xl font-semibold tracking-[-0.03em] sm:text-4xl'>
              {t('home.brand.boundaryTitle', {
                defaultValue: '边界清晰，规则可见',
              })}
            </h2>
            <p className='text-muted-foreground mt-3 max-w-2xl text-sm leading-6'>
              {t('home.brand.boundaryDescription', {
                defaultValue:
                  '清晰说明平台负责的范围、使用者需要遵守的规则，以及发生异常后的处理入口。',
              })}
            </p>
          </motion.div>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className='bg-border grid gap-px md:grid-cols-3'
          >
            {policies.map((policy) => (
              <article key={policy.title} className='bg-card p-7 md:p-8'>
                <div className='border-border bg-background mb-7 flex size-9 items-center justify-center border'>
                  <policy.icon className='text-muted-foreground size-4' />
                </div>
                <h3 className='text-base font-semibold'>{policy.title}</h3>
                <p className='text-muted-foreground mt-3 text-xs leading-5'>
                  {policy.lead}
                </p>
                <ul className='mt-6 space-y-3'>
                  {policy.items.map((item) => (
                    <li
                      key={item}
                      className='text-muted-foreground flex gap-3 text-xs leading-5'
                    >
                      <span className='bg-primary mt-2 size-1 shrink-0 rounded-full' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      <section aria-hidden='true' className='hidden'>
        <div className='pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--foreground)_7%,transparent),transparent_58%)]' />
        <div className='relative mx-auto max-w-7xl'>
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className='text-foreground/10 mx-auto max-w-4xl text-center text-[clamp(2.7rem,7vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.055em]'
          >
            {t('home.brand.statement', {
              defaultValue: '所有模型。一个网关。清晰可控。',
            })}
          </motion.h2>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className='border-primary/15 bg-primary/[0.035] shadow-primary/10 mt-40 overflow-hidden rounded-t-3xl border shadow-2xl md:mt-52'
          >
            <div className='grid bg-[linear-gradient(color-mix(in_oklab,var(--primary)_8%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--primary)_8%,transparent)_1px,transparent_1px)] bg-[size:32px_32px] md:grid-cols-[1.2fr_1fr]'>
              <div className='p-7 sm:p-10 md:p-14'>
                <div className='flex flex-wrap items-end justify-between gap-8'>
                  <div>
                    <p className='text-muted-foreground text-xs'>
                      {t('home.brand.requestJourney', {
                        defaultValue: '跟随一次请求',
                      })}
                    </p>
                    <h3 className='mt-2 text-3xl font-semibold tracking-tight'>
                      {t('home.brand.requestTitle', {
                        defaultValue: '从应用到上游，再回到调用记录',
                      })}
                    </h3>
                  </div>
                  <div className='flex gap-8 font-mono text-xs'>
                    <div>
                      <span className='text-muted-foreground block'>
                        LATENCY
                      </span>
                      <strong className='mt-1 block text-lg'>
                        187<span className='text-primary'>ms</span>
                      </strong>
                    </div>
                    <div>
                      <span className='text-muted-foreground block'>TOKEN</span>
                      <strong className='text-primary mt-1 block text-lg'>
                        2,148
                      </strong>
                    </div>
                  </div>
                </div>

                <div className='mt-12 flex flex-wrap items-center gap-3'>
                  <div className='border-border/70 bg-background/45 text-muted-foreground flex items-center gap-2 border px-3 py-2 text-xs'>
                    <span>
                      {t('home.brand.yourApp', { defaultValue: '你的应用' })}
                    </span>
                  </div>
                  <ArrowRight className='text-primary/70 size-4' />
                  <div className='border-primary/25 bg-primary/10 flex items-center gap-2 border px-3 py-2 text-xs'>
                    <img
                      src={props.logo}
                      alt={props.systemName}
                      className='size-5 rounded object-contain'
                    />
                    <span>{props.systemName}</span>
                  </div>
                  <ArrowRight className='text-primary/70 size-4' />
                  {['OpenAI', 'Claude', 'Gemini'].map((model) => (
                    <span
                      key={model}
                      className='border-border/70 text-muted-foreground border px-3 py-2 text-[11px]'
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              <div className='border-primary/15 grid border-t md:border-t-0 md:border-l'>
                {[
                  {
                    icon: Send,
                    title: t('home.brand.sendTitle', { defaultValue: '发送' }),
                    text: t('home.brand.sendDescription', {
                      defaultValue: '一个端点、一把密钥，按兼容协议发出请求。',
                    }),
                  },
                  {
                    icon: Route,
                    title: t('home.brand.routeTitle', { defaultValue: '路由' }),
                    text: t('home.brand.routeDescription', {
                      defaultValue: '网关按渠道配置与可用状态选择上游。',
                    }),
                  },
                  {
                    icon: Activity,
                    title: t('home.brand.observeTitle', {
                      defaultValue: '观测',
                    }),
                    text: t('home.brand.observeDescription', {
                      defaultValue: '耗时、Token、模型和计费结果记录在案。',
                    }),
                  },
                ].map((step) => (
                  <article
                    key={step.title}
                    className='border-primary/10 border-b p-7 last:border-b-0 sm:p-8'
                  >
                    <step.icon className='text-primary size-4' />
                    <h3 className='mt-4 text-xl font-semibold'>{step.title}</h3>
                    <p className='text-muted-foreground mt-2 text-xs leading-5'>
                      {step.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
