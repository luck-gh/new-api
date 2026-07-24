/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const TILE_SIZE = 24
const EFFECT_RADIUS = 115
const RECOVERY_TIME = 1550

type Fragment = {
  amount: number
  offsetX: number
  offsetY: number
}

export function SourceHomeEasterEgg(props: { systemName: string }) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const source = document.createElement('canvas')
    const sourceContext = source.getContext('2d')
    if (!sourceContext) return

    const fragments = new Map<number, Fragment>()
    let animationFrame = 0
    let lastFrame = performance.now()
    let logicalWidth = 0
    let logicalHeight = 0

    const renderSource = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      logicalWidth = canvas.clientWidth
      logicalHeight = canvas.clientHeight
      canvas.width = Math.max(1, Math.floor(logicalWidth * ratio))
      canvas.height = Math.max(1, Math.floor(logicalHeight * ratio))
      source.width = canvas.width
      source.height = canvas.height
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      sourceContext.setTransform(ratio, 0, 0, ratio, 0, 0)
      sourceContext.clearRect(0, 0, logicalWidth, logicalHeight)

      const dark = document.documentElement.classList.contains('dark')
      const title = props.systemName.toUpperCase()
      const fontSize = Math.min(
        logicalHeight * 0.7,
        logicalWidth / Math.max(title.length * 0.58, 1)
      )
      sourceContext.font = `800 ${fontSize}px "Public Sans", ui-sans-serif, system-ui, sans-serif`
      sourceContext.textAlign = 'center'
      sourceContext.textBaseline = 'middle'
      sourceContext.fillStyle = dark ? '#c8d7f2' : '#0f172a'
      sourceContext.fillText(
        title,
        logicalWidth / 2,
        logicalHeight / 2 + fontSize * 0.03
      )
    }

    const draw = (now = performance.now()) => {
      const delta = Math.min(now - lastFrame, 50)
      lastFrame = now
      context.clearRect(0, 0, logicalWidth, logicalHeight)
      const columns = Math.ceil(logicalWidth / TILE_SIZE)
      const rows = Math.ceil(logicalHeight / TILE_SIZE)
      let active = false

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = row * columns + column
          const fragment = fragments.get(index)
          const amount = fragment?.amount ?? 0
          const sourceX = column * TILE_SIZE
          const sourceY = row * TILE_SIZE
          const width = Math.min(TILE_SIZE, logicalWidth - sourceX)
          const height = Math.min(TILE_SIZE, logicalHeight - sourceY)
          const gap = amount > 0 ? Math.min(1.4, amount * 1.4) : 0
          const offsetX = (fragment?.offsetX ?? 0) * amount
          const offsetY = (fragment?.offsetY ?? 0) * amount
          context.drawImage(
            source,
            sourceX * (source.width / logicalWidth),
            sourceY * (source.height / logicalHeight),
            width * (source.width / logicalWidth),
            height * (source.height / logicalHeight),
            sourceX + offsetX + gap / 2,
            sourceY + offsetY + gap / 2,
            Math.max(0, width - gap),
            Math.max(0, height - gap)
          )

          if (fragment) {
            fragment.amount = Math.max(
              0,
              fragment.amount - delta / RECOVERY_TIME
            )
            if (fragment.amount <= 0) fragments.delete(index)
            else active = true
          }
        }
      }

      if (active) animationFrame = window.requestAnimationFrame(draw)
      else animationFrame = 0
    }

    const redraw = () => {
      renderSource()
      draw()
    }

    const activateFragments = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      const pointerX = event.clientX - bounds.left
      const pointerY = event.clientY - bounds.top
      const columns = Math.ceil(logicalWidth / TILE_SIZE)
      const rows = Math.ceil(logicalHeight / TILE_SIZE)

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const centerX = column * TILE_SIZE + TILE_SIZE / 2
          const centerY = row * TILE_SIZE + TILE_SIZE / 2
          const distance = Math.hypot(centerX - pointerX, centerY - pointerY)
          if (distance > EFFECT_RADIUS) continue
          const index = row * columns + column
          const direction = ((index * 37) % 11) - 5
          fragments.set(index, {
            amount: Math.max(0.2, 1 - distance / EFFECT_RADIUS),
            offsetX: direction * 0.65,
            offsetY: (((index * 19) % 9) - 4) * 0.55,
          })
        }
      }

      if (!animationFrame) {
        lastFrame = performance.now()
        animationFrame = window.requestAnimationFrame(draw)
      }
    }

    const resizeObserver = new ResizeObserver(redraw)
    const themeObserver = new MutationObserver(redraw)
    resizeObserver.observe(canvas)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    canvas.addEventListener('pointermove', activateFragments, { passive: true })
    redraw()

    return () => {
      resizeObserver.disconnect()
      themeObserver.disconnect()
      canvas.removeEventListener('pointermove', activateFragments)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [props.systemName])

  return (
    <section className='bg-card/90 border-border/60 relative z-10 overflow-hidden border-y py-10 backdrop-blur-sm'>
      <div className='mx-auto max-w-7xl px-5 sm:px-8'>
        <p className='text-muted-foreground text-xs tracking-[0.2em] uppercase'>
          {t('home.brand.easterEggHint', {
            defaultValue: '移动鼠标，发现字符彩蛋',
          })}
        </p>
      </div>
      <canvas
        ref={canvasRef}
        aria-label={props.systemName}
        className='mt-4 block h-[clamp(12rem,24vw,23rem)] w-full cursor-default'
      />
    </section>
  )
}
