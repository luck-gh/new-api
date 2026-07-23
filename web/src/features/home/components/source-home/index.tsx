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
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Footer } from '@/components/layout/components/footer'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'

import { SourceHomeCharacterField } from './source-home-character-field'
import { SourceHomeEasterEgg } from './source-home-easter-egg'
import { SourceHomeHero } from './source-home-hero'
import { SourceHomePolicyAndRequest } from './source-home-policy-and-request'
import { SourceHomeRequestJourney } from './source-home-request-journey'
import { SourceHomeTrust } from './source-home-trust'

type SourceHomeProps = {
  isAuthenticated: boolean
}

export function SourceHome(props: SourceHomeProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const { systemName, logo } = useSystemConfig()
  const apiBase =
    (status?.server_address as string | undefined)?.replace(/\/$/, '') ||
    window.location.origin
  const docsUrl = (status?.docs_link as string | undefined)?.trim() || '/docs/'

  const copyApiBase = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(apiBase)
      toast.success(
        t('home.brand.copySuccess', { defaultValue: 'API 地址已复制' })
      )
    } catch {
      toast.error(
        t('home.brand.copyFailed', {
          defaultValue: '复制失败，请手动选择 API 地址',
        })
      )
    }
  }, [apiBase, t])

  return (
    <div className='bg-background relative isolate overflow-clip'>
      <SourceHomeCharacterField />
      <div className='relative z-10'>
        <SourceHomeHero
          apiBase={apiBase}
          docsUrl={docsUrl}
          isAuthenticated={props.isAuthenticated}
          logo={logo}
          onCopyApiBase={copyApiBase}
          systemName={systemName}
        />
        <SourceHomeTrust systemName={systemName} />
        <SourceHomePolicyAndRequest logo={logo} systemName={systemName} />
        <SourceHomeRequestJourney logo={logo} systemName={systemName} />
        <SourceHomeEasterEgg systemName={systemName} />
        <Footer />
      </div>
    </div>
  )
}
