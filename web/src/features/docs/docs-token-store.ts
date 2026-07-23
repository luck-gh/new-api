/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { create } from 'zustand'

type DocsTokenState = {
  userId: number | null
  tokenId: number | null
  tokenName: string
  token: string
  setToken: (
    userId: number,
    tokenId: number,
    tokenName: string,
    token: string
  ) => void
  clearToken: () => void
}

export const useDocsTokenStore = create<DocsTokenState>()((set) => ({
  userId: null,
  tokenId: null,
  tokenName: '',
  token: '',
  setToken: (userId, tokenId, tokenName, token) =>
    set({ userId, tokenId, tokenName, token }),
  clearToken: () =>
    set({ userId: null, tokenId: null, tokenName: '', token: '' }),
}))

export function getDocsTokenForUser(
  state: Pick<DocsTokenState, 'userId' | 'token'>,
  userId: number | undefined
): string {
  return userId !== undefined && state.userId === userId ? state.token : ''
}

export function injectDocsToken(code: string, token: string): string {
  if (!token) return code
  return code
    .replaceAll('$NEW_API_KEY', token)
    .replaceAll('sk-your-api-key', token)
    .replaceAll('YOUR_API_KEY', token)
}
