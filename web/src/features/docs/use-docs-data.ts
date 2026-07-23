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
import { useQuery } from '@tanstack/react-query'

import type { DocsData } from './types'

export function useDocsData(apiBase: string) {
  return useQuery({
    queryKey: ['public-docs', apiBase],
    queryFn: async () => {
      const response = await fetch('/docs/data/docs.json')
      if (!response.ok) {
        throw new Error(`Unable to load docs data: ${response.status}`)
      }

      const data = (await response.json()) as DocsData
      let apiHost = apiBase
      try {
        apiHost = new URL(apiBase).host
      } catch {
        apiHost = apiBase.replace(/^https?:\/\//, '')
      }

      return {
        guides: data.guides.map((guide) => ({
          ...guide,
          html: guide.html
            .replaceAll('{{API_BASE}}', apiBase)
            .replaceAll('{{API_HOST}}', apiHost),
        })),
        endpoints: data.endpoints.map((endpoint) => ({
          ...endpoint,
          requestExample: endpoint.requestExample.replaceAll(
            '{{API_BASE}}',
            apiBase
          ),
          responseExample: endpoint.responseExample.replaceAll(
            '{{API_BASE}}',
            apiBase
          ),
        })),
      } satisfies DocsData
    },
    staleTime: Number.POSITIVE_INFINITY,
  })
}
