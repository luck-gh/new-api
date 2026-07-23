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
  BadgeCheck,
  ChartNoAxesCombined,
  CircleDollarSign,
  CloudCog,
  LifeBuoy,
  Network,
  ShieldCheck,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'

type SourceHomeTrustProps = {
  systemName: string
}

const MODEL_GROUPS = [
  ['OpenAI', 'Claude', 'Gemini'],
  ['DeepSeek', 'Qwen', 'GLM'],
]

export function SourceHomeTrust(props: SourceHomeTrustProps) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()

  return (
    <section className='bg-muted/20 text-foreground px-5 py-20 transition-colors duration-700 sm:px-8 md:py-28'>
      <div className='mx-auto max-w-7xl'>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className='mb-12 max-w-3xl'
        >
          <h2 className='text-3xl font-semibold tracking-[-0.03em] sm:text-4xl'>
            {t('home.brand.trustTitle', {
              defaultValue: '稳定接入、透明配置、状态可查',
            })}
          </h2>
          <p className='text-muted-foreground mt-3 text-sm leading-6'>
            {t('home.brand.trustDescription', {
              defaultValue:
                '不写无法核验的营销承诺。模型、倍率、渠道和服务状态以控制台中的实时配置为准。',
            })}
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className='border-border/70 bg-card/50 grid border md:grid-cols-3'
        >
          <article className='border-border/70 border-b p-6 md:col-span-2 md:border-r md:p-8'>
            <div className='mb-6 flex items-center gap-3'>
              <Network className='text-primary size-4' />
              <h3 className='text-sm font-semibold'>
                {t('home.brand.gatewayTitle', {
                  defaultValue: '一条 API，接入已配置模型',
                })}
              </h3>
            </div>
            <p className='text-muted-foreground max-w-2xl text-xs leading-5'>
              {t('home.brand.gatewayDescription', {
                defaultValue:
                  '{{systemName}} 通过统一协议将请求路由到管理员启用的上游渠道，调用方只需要维护一个基础地址。',
                systemName: props.systemName,
              })}
            </p>
            <div className='mt-7 grid gap-2 sm:grid-cols-3'>
              {MODEL_GROUPS.flat().map((model, index) => (
                <div
                  key={model}
                  className='border-border/70 bg-background/45 text-muted-foreground border px-3 py-2.5 text-center text-[11px]'
                >
                  <span className='text-primary/75 mr-2'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {model}
                </div>
              ))}
            </div>
          </article>

          <article className='border-border/70 border-b p-6 md:p-8'>
            <div className='mb-5 flex items-center gap-3'>
              <BadgeCheck className='size-4 text-cyan-400' />
              <h3 className='text-sm font-semibold'>
                {t('home.brand.statusTitle', { defaultValue: '实时状态' })}
              </h3>
            </div>
            <p className='text-muted-foreground text-xs leading-5'>
              {t('home.brand.statusDescription', {
                defaultValue: '可用模型与渠道状态以控制台实时结果为准。',
              })}
            </p>
            <div className='mt-6 space-y-3'>
              {['Chat Completions', 'Responses API', 'Embeddings'].map(
                (item) => (
                  <div
                    key={item}
                    className='border-border/50 flex items-center justify-between border-b pb-2 text-[11px]'
                  >
                    <span className='text-muted-foreground'>{item}</span>
                    <span className='text-primary'>
                      {t('home.brand.configured', {
                        defaultValue: '按配置开放',
                      })}
                    </span>
                  </div>
                )
              )}
            </div>
          </article>

          <article className='border-border/70 border-b p-6 md:col-span-2 md:border-r md:p-8'>
            <div className='grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end'>
              <div>
                <div className='mb-5 flex items-center gap-3'>
                  <CircleDollarSign className='size-4 text-emerald-400' />
                  <h3 className='text-sm font-semibold'>
                    {t('home.brand.pricingTitle', {
                      defaultValue: '计费信息透明展示',
                    })}
                  </h3>
                </div>
                <p className='text-muted-foreground max-w-xl text-xs leading-5'>
                  {t('home.brand.pricingDescription', {
                    defaultValue:
                      '模型价格、分组倍率和余额换算统一展示在模型与控制台页面，调整后由管理员配置即时生效。',
                  })}
                </p>
              </div>
              <div className='bg-border grid min-w-52 grid-cols-2 gap-px text-center text-[10px]'>
                <div className='bg-card text-muted-foreground px-4 py-3'>
                  {t('home.brand.input', { defaultValue: '输入' })}
                </div>
                <div className='bg-card text-muted-foreground px-4 py-3'>
                  {t('home.brand.output', { defaultValue: '输出' })}
                </div>
                <div className='bg-background px-4 py-3'>TOKEN</div>
                <div className='bg-background px-4 py-3'>TOKEN</div>
              </div>
            </div>
          </article>

          <article className='border-border/70 border-b p-6 md:p-8'>
            <CloudCog className='mb-5 size-4 text-violet-400' />
            <h3 className='text-sm font-semibold'>
              {t('home.brand.channelTitle', { defaultValue: '渠道由你管理' })}
            </h3>
            <p className='text-muted-foreground mt-3 text-xs leading-5'>
              {t('home.brand.channelDescription', {
                defaultValue:
                  '启用范围、优先级、权重与故障转移规则均由管理员在渠道设置中控制。',
              })}
            </p>
          </article>

          <article className='border-border/70 border-b p-6 md:border-r md:p-8'>
            <ChartNoAxesCombined className='mb-5 size-4 text-cyan-400' />
            <h3 className='text-sm font-semibold'>
              {t('home.brand.observabilityTitle', {
                defaultValue: '调用记录可追踪',
              })}
            </h3>
            <p className='text-muted-foreground mt-3 text-xs leading-5'>
              {t('home.brand.observabilityDescription', {
                defaultValue: '查看令牌、耗时、模型、渠道和计费结果。',
              })}
            </p>
          </article>

          <article className='border-border/70 border-b p-6 md:border-r md:p-8'>
            <ShieldCheck className='mb-5 size-4 text-emerald-400' />
            <h3 className='text-sm font-semibold'>
              {t('home.brand.permissionTitle', {
                defaultValue: '令牌与权限隔离',
              })}
            </h3>
            <p className='text-muted-foreground mt-3 text-xs leading-5'>
              {t('home.brand.permissionDescription', {
                defaultValue: '按用户、分组与令牌控制模型访问范围。',
              })}
            </p>
          </article>

          <article className='border-border/70 border-b p-6 md:p-8'>
            <LifeBuoy className='mb-5 size-4 text-amber-400' />
            <h3 className='text-sm font-semibold'>
              {t('home.brand.supportTitle', { defaultValue: '站内支持' })}
            </h3>
            <p className='text-muted-foreground mt-3 text-xs leading-5'>
              {t('home.brand.supportDescription', {
                defaultValue: '通过公告和站内工单说明服务状态与处理结果。',
              })}
            </p>
          </article>
        </motion.div>
      </div>
    </section>
  )
}
