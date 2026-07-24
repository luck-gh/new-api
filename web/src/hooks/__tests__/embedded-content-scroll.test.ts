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
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  EMBEDDED_SCROLL_MESSAGE,
  readEmbeddedScrollState,
} from '../use-embedded-content-scroll.ts'

const expectedSource = {} as WindowProxy

test('accepts a boolean scroll state from the active embedded page', () => {
  const event = {
    source: expectedSource,
    data: { type: EMBEDDED_SCROLL_MESSAGE, scrolled: true },
  } as MessageEvent

  assert.equal(readEmbeddedScrollState(event, expectedSource), true)
})

test('rejects scroll messages from a different frame', () => {
  const event = {
    source: {} as WindowProxy,
    data: { type: EMBEDDED_SCROLL_MESSAGE, scrolled: true },
  } as MessageEvent

  assert.equal(readEmbeddedScrollState(event, expectedSource), null)
})

test('rejects malformed scroll state payloads', () => {
  const event = {
    source: expectedSource,
    data: { type: EMBEDDED_SCROLL_MESSAGE, scrolled: 'yes' },
  } as MessageEvent

  assert.equal(readEmbeddedScrollState(event, expectedSource), null)
})
