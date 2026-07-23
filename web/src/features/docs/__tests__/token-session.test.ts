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
import { afterEach, describe, test } from 'node:test'

import {
  getDocsTokenForUser,
  injectDocsToken,
  useDocsTokenStore,
} from '../docs-token-store.ts'

afterEach(() => {
  useDocsTokenStore.getState().clearToken()
})

describe('documentation API key session', () => {
  test('injects the selected key into every supported example placeholder', () => {
    const example = '$NEW_API_KEY sk-your-api-key YOUR_API_KEY $NEW_API_KEY'

    assert.equal(
      injectDocsToken(example, 'session-token'),
      'session-token session-token session-token session-token'
    )
  })

  test('leaves examples unchanged until a key is selected', () => {
    const example = 'Authorization: Bearer $NEW_API_KEY'

    assert.equal(injectDocsToken(example, ''), example)
  })

  test('clears the in-memory key and identifying metadata together', () => {
    const store = useDocsTokenStore.getState()
    store.setToken(7, 42, 'Documentation key', 'session-token')

    assert.deepEqual(
      {
        userId: useDocsTokenStore.getState().userId,
        tokenId: useDocsTokenStore.getState().tokenId,
        tokenName: useDocsTokenStore.getState().tokenName,
        token: useDocsTokenStore.getState().token,
      },
      {
        userId: 7,
        tokenId: 42,
        tokenName: 'Documentation key',
        token: 'session-token',
      }
    )

    useDocsTokenStore.getState().clearToken()

    assert.deepEqual(
      {
        userId: useDocsTokenStore.getState().userId,
        tokenId: useDocsTokenStore.getState().tokenId,
        tokenName: useDocsTokenStore.getState().tokenName,
        token: useDocsTokenStore.getState().token,
      },
      { userId: null, tokenId: null, tokenName: '', token: '' }
    )
  })

  test('never exposes a memory-only key to a different signed-in user', () => {
    useDocsTokenStore
      .getState()
      .setToken(7, 42, 'Documentation key', 'session-token')

    assert.equal(
      getDocsTokenForUser(useDocsTokenStore.getState(), 7),
      'session-token'
    )
    assert.equal(getDocsTokenForUser(useDocsTokenStore.getState(), 8), '')
    assert.equal(
      getDocsTokenForUser(useDocsTokenStore.getState(), undefined),
      ''
    )
  })
})
