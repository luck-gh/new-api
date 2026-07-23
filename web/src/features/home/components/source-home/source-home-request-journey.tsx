/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { Activity, Monitor, Route, Send } from 'lucide-react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

type SourceHomeRequestJourneyProps = {
  logo: string
  systemName: string
}

export function SourceHomeRequestJourney(props: SourceHomeRequestJourneyProps) {
  const { t } = useTranslation()
  const target = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState(0)
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start start', 'end end'],
  })
  const progress = useTransform(scrollYProgress, [0.08, 0.88], ['0%', '100%'])
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    let next = 2
    if (value < 0.34) next = 0
    else if (value < 0.67) next = 1
    setPhase((current) => (current === next ? current : next))
  })

  const steps = [
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
      title: t('home.brand.observeTitle', { defaultValue: '观测' }),
      text: t('home.brand.observeDescription', {
        defaultValue: '耗时、Token、模型和计费结果记录在案。',
      }),
    },
  ]
  const current = steps[reduceMotion ? 2 : phase]

  return (
    <section ref={target} className='relative h-[310svh]'>
      <div className='sticky top-0 flex min-h-svh items-center overflow-hidden px-5 py-24 sm:px-8'>
        <div className='bg-background/80 border-primary/15 relative mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] border p-7 shadow-2xl backdrop-blur-md sm:p-10 lg:p-14'>
          <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(color-mix(in_oklab,var(--primary)_10%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--primary)_10%,transparent)_1px,transparent_1px)] bg-[size:52px_52px]' />
          <div className='relative'>
            <div className='flex flex-wrap items-end justify-between gap-8'>
              <div>
                <p className='text-primary text-xs font-semibold tracking-[0.2em] uppercase'>
                  {t('home.brand.requestJourney', {
                    defaultValue: '跟随一次请求',
                  })}
                </p>
                <motion.h2
                  key={current.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'
                >
                  {current.title}
                </motion.h2>
                <p className='text-muted-foreground mt-3 max-w-xl text-sm leading-6'>
                  {current.text}
                </p>
              </div>
              <div className='flex gap-8 font-mono text-xs'>
                <div>
                  <span className='text-muted-foreground block'>
                    {t('home.brand.latency')}
                  </span>
                  <strong className='mt-1 block text-2xl'>
                    {phase === 2 ? 187 : 0}
                    <span className='text-primary text-sm'>ms</span>
                  </strong>
                </div>
                <div>
                  <span className='text-muted-foreground block'>
                    {t('home.brand.tokens')}
                  </span>
                  <strong className='text-primary mt-1 block text-2xl'>
                    {phase === 2 ? '2,148' : '0'}
                  </strong>
                </div>
              </div>
            </div>

            <div className='mt-24 grid items-center gap-5 lg:grid-cols-[auto_1fr_auto_1fr_auto]'>
              <div className='border-border bg-background/70 flex items-center gap-2 border px-4 py-3 text-sm'>
                <Monitor className='size-4' />
                {t('home.brand.yourApp', { defaultValue: '你的应用' })}
              </div>
              <div className='bg-border relative h-px overflow-hidden'>
                <motion.div
                  className='bg-primary absolute inset-y-0 left-0'
                  style={{ width: progress }}
                />
              </div>
              <motion.div
                animate={{ scale: phase === 1 ? 1.07 : 1 }}
                className='border-primary/30 bg-primary/10 flex items-center gap-2 border px-4 py-3 text-sm shadow-lg'
              >
                <img
                  src={props.logo}
                  alt=''
                  className='size-5 rounded object-contain'
                />
                {props.systemName}
              </motion.div>
              <div className='bg-border relative h-px overflow-hidden'>
                <motion.div
                  className='bg-primary absolute inset-y-0 left-0'
                  style={{ width: progress }}
                />
              </div>
              <div className='grid gap-2'>
                {['OpenAI', 'Claude', 'Gemini'].map((model, index) => (
                  <div
                    key={model}
                    className={cn(
                      'border-border bg-background/60 border px-5 py-2 text-center text-xs transition-all duration-500',
                      phase >= 1 &&
                        'border-primary/70 text-foreground shadow-primary/15 shadow-lg',
                      phase === 1 && index !== 0 && 'opacity-60'
                    )}
                  >
                    {model}
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-20 grid gap-2 sm:grid-cols-3'>
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={cn(
                    'border-border/70 border p-4 transition-colors duration-500',
                    index === phase && 'border-primary/50 bg-primary/8'
                  )}
                >
                  <step.icon className='text-primary size-4' />
                  <span className='mt-3 block text-sm font-semibold'>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
