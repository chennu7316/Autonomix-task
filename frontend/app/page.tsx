'use client'

import { useState, useEffect } from 'react'
import Dashboard from '@/components/Dashboard'
import TranscriptUpload from '@/components/TranscriptUpload'
import ActionItemsList from '@/components/ActionItemsList'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading InsightBoard AI...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'transcripts' && <TranscriptUpload />}
              {activeTab === 'action-items' && <ActionItemsList />}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
