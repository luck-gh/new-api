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
import { Link } from '@tanstack/react-router'

import { Skeleton } from '@/components/ui/skeleton'
import { useSystemConfig } from '@/hooks/use-system-config'

export function ErrorPageBrand() {
  const { systemName, logo, loading } = useSystemConfig()

  return (
    <Link
      to='/'
      className='mb-6 flex items-center gap-2.5 transition-opacity hover:opacity-80'
      aria-label={systemName}
    >
      {loading ? (
        <>
          <Skeleton className='size-9 rounded-lg' />
          <Skeleton className='h-5 w-24' />
        </>
      ) : (
        <>
          <img src={logo} alt='' className='size-9 rounded-lg object-contain' />
          <span className='text-base font-semibold tracking-tight'>
            {systemName}
          </span>
        </>
      )}
    </Link>
  )
}
