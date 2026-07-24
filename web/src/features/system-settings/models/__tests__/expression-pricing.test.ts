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
import { describe, test } from 'node:test'

import { modelJsonFields } from '../model-ratio-json-fields.ts'
import { refreshSystemOptionsAfterRatioSync } from '../refresh-system-options-after-sync.ts'
import { formatJsonForTextarea, normalizeJsonString } from '../utils.ts'

describe('expression pricing JSON mode', () => {
  test('exposes the billing mode and complete expression maps', () => {
    const billingFields = modelJsonFields.filter(
      (field) => field.name === 'BillingMode' || field.name === 'BillingExpr'
    )

    assert.deepEqual(
      billingFields.map((field) => field.name),
      ['BillingMode', 'BillingExpr']
    )
    assert.match(billingFields[0].descriptionKey, /tiered_expr/)
    assert.match(billingFields[1].descriptionKey, /\|\|\|/)
  })

  test('preserves request rules while formatting and normalizing the map', () => {
    const expression =
      'tier("base", p * 2 + c * 8)|||when(header("x-priority") has "fast") * 2'
    const rawMap = JSON.stringify({ 'example-model': expression })

    const formatted = formatJsonForTextarea(rawMap)
    const normalized = normalizeJsonString(formatted)

    assert.equal(
      (JSON.parse(normalized) as Record<string, string>)['example-model'],
      expression
    )
  })
})

describe('expression pricing upstream sync', () => {
  test('waits for system options to refresh before resolving', async () => {
    let finishRefresh: (() => void) | undefined
    let refreshFinished = false
    const refreshPromise = new Promise<void>((resolve) => {
      finishRefresh = () => {
        refreshFinished = true
        resolve()
      }
    })

    const pending = refreshSystemOptionsAfterRatioSync({
      invalidateQueries: async (filters) => {
        assert.deepEqual(filters, { queryKey: ['system-options'] })
        await refreshPromise
      },
    })

    await Promise.resolve()
    assert.equal(refreshFinished, false)

    finishRefresh?.()
    await pending
    assert.equal(refreshFinished, true)
  })
})
