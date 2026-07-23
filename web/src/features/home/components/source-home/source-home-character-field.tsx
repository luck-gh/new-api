/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { useEffect, useRef } from 'react'

const GLYPHS = '01<>/\\[]{}()=+-_*#@AI'

export function SourceHomeCharacterField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const pointer = { x: -1000, y: -1000 }
    let columns = 0
    let rows = 0
    let frame = 0
    let timer = 0
    let cells: number[] = []
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      columns = Math.ceil(window.innerWidth / 18)
      rows = Math.ceil(window.innerHeight / 19)
      cells = Array.from(
        { length: columns * rows },
        (_, index) =>
          (index * 17 + Math.floor(index / columns) * 11) % GLYPHS.length
      )
    }

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      const dark = document.documentElement.classList.contains('dark')
      context.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
      context.textBaseline = 'middle'
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = row * columns + column
          const x = column * 18 + 5
          const y = row * 19 + 8
          const distance = Math.hypot(x - pointer.x, y - pointer.y)
          const influence = Math.max(0, 1 - distance / 190)
          if (influence > 0.15 && !reduceMotion.matches) {
            cells[index] =
              (cells[index] + (Math.random() > 0.6 ? 1 : 0)) % GLYPHS.length
          }
          const baseAlpha = dark ? 0.055 : 0.04
          const alpha = Math.min(baseAlpha + influence * 0.28, 0.32)
          context.fillStyle = dark
            ? `rgba(148, 163, 184, ${alpha})`
            : `rgba(71, 85, 105, ${alpha})`
          context.fillText(GLYPHS[cells[index]], x, y)
        }
      }
      frame += 1
      if (!reduceMotion.matches && frame % 4 === 0) {
        const index = Math.floor(Math.random() * cells.length)
        cells[index] = (cells[index] + 1) % GLYPHS.length
      }
    }

    const loop = () => {
      draw()
      timer = window.setTimeout(loop, reduceMotion.matches ? 800 : 70)
    }
    const move = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      if (reduceMotion.matches) draw()
    }
    const leave = () => {
      pointer.x = -1000
      pointer.y = -1000
    }

    resize()
    loop()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 z-0 opacity-90'
    />
  )
}
