/*
Copyright (C) 2023-2026 QuantumNous
*/
import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import {
  getSupportTicketApiPath,
  getSupportTicketListParams,
  getSupportTicketReopenStatus,
} from '../support-ticket.ts'

describe('support ticket client contract', () => {
  test('uses the authenticated user endpoint without exposing a user filter', () => {
    assert.equal(getSupportTicketApiPath(false), '/api/user/support/tickets')
    assert.deepEqual(
      getSupportTicketListParams(false, {
        page: 1,
        pageSize: 20,
        status: '',
        category: '',
        keyword: 'another user',
      }),
      {
        p: 1,
        page_size: 20,
        status: undefined,
        category: undefined,
        keyword: undefined,
      }
    )
  })

  test('uses the administrator endpoint and forwards its search filter', () => {
    assert.equal(getSupportTicketApiPath(true), '/api/support/admin/tickets')
    assert.deepEqual(
      getSupportTicketListParams(true, {
        page: 2,
        pageSize: 20,
        status: 'pending_admin',
        category: 'api',
        keyword: 'alice',
      }),
      {
        p: 2,
        page_size: 20,
        status: 'pending_admin',
        category: 'api',
        keyword: 'alice',
      }
    )
  })

  test('reopens tickets into the queue owned by the acting role', () => {
    assert.equal(getSupportTicketReopenStatus(false), 'pending_admin')
    assert.equal(getSupportTicketReopenStatus(true), 'pending_user')
  })
})
