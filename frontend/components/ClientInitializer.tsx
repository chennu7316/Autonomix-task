'use client'

import { useEffect } from 'react'
import initializeFetchInterceptor from '../utils/fetchInterceptor'

export default function ClientInitializer() {
  useEffect(() => {
    // Initialize fetch interceptor on client side only
    initializeFetchInterceptor()
  }, [])

  return null // This component doesn't render anything
}
