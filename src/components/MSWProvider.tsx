'use client'

import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function enableMocking() {
      if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')) {
        const { worker } = await import('@/mocks/browser')
        await worker.start({
          onUnhandledRequest: 'bypass',
        })
      }
    }

    enableMocking()
  }, [])

  return <>{children}</>
}
