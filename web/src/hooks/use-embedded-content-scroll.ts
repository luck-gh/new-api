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
import { startTransition, useEffect, useState, type RefObject } from 'react'

export const EMBEDDED_SCROLL_MESSAGE = 'newapi:embedded-scroll'

export function readEmbeddedScrollState(
  event: MessageEvent,
  expectedSource: MessageEventSource | null
): boolean | null {
  if (!expectedSource || event.source !== expectedSource) return null
  if (typeof event.data !== 'object' || event.data === null) return null

  const data = event.data as { type?: unknown; scrolled?: unknown }
  if (
    data.type !== EMBEDDED_SCROLL_MESSAGE ||
    typeof data.scrolled !== 'boolean'
  ) {
    return null
  }

  return data.scrolled
}

export function useEmbeddedContentScroll(
  iframeRef: RefObject<HTMLIFrameElement | null>,
  enabled: boolean
): boolean {
  const [contentScrolled, setContentScrolled] = useState(false)

  useEffect(() => {
    if (!enabled) {
      startTransition(() => setContentScrolled(false))
      return
    }

    const handleMessage = (event: MessageEvent) => {
      const scrollState = readEmbeddedScrollState(
        event,
        iframeRef.current?.contentWindow ?? null
      )
      if (scrollState === null) return

      startTransition(() => setContentScrolled(scrollState))
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [enabled, iframeRef])

  return contentScrolled
}
