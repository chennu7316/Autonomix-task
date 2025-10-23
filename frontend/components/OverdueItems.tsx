'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Calendar, User } from 'lucide-react'

interface OverdueItem {
  id: number
  title: string
  description: string
  assignee: string
  due_date: string
  status: string
  priority: string
  transcript_title: string
}

export default function OverdueItems() {
  const [overdueItems, setOverdueItems] = useState<OverdueItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOverdueItems()
  }, [])

  const fetchOverdueItems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/overdue-items`)
      if (response.ok) {
        const data = await response.json()
        setOverdueItems(data)
      }
    } catch (error) {
      console.error('Error fetching overdue items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = now.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (overdueItems.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Overdue Items</h3>
        </div>
        <div className="text-center py-6">
          <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-green-600 font-medium">All caught up!</p>
          <p className="text-sm text-gray-500">No overdue action items</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-900">Overdue Items</h3>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
          {overdueItems.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {overdueItems.map((item) => (
          <div key={item.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <span className={`status-badge ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {item.assignee && (
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{item.assignee}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-red-600">
                    <Calendar className="w-3 h-3" />
                    <span>{getDaysOverdue(item.due_date)} days overdue</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    From: {item.transcript_title}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


