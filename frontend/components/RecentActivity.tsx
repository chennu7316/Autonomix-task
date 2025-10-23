'use client'

import { useState, useEffect } from 'react'
import { FileText, CheckSquare, Clock } from 'lucide-react'

interface ActivityItem {
  type: 'transcript' | 'action_item'
  id: number
  title: string
  created_at: string
  status?: string
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/recent-activity`)
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: string, status?: string) => {
    if (type === 'transcript') {
      return <FileText className="w-4 h-4 text-blue-600" />
    }
    
    switch (status) {
      case 'completed':
        return <CheckSquare className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      default:
        return <CheckSquare className="w-4 h-4 text-yellow-600" />
    }
  }

  const getActivityText = (type: string, status?: string) => {
    if (type === 'transcript') {
      return 'New transcript uploaded'
    }
    
    switch (status) {
      case 'completed':
        return 'Action item completed'
      case 'in_progress':
        return 'Action item in progress'
      default:
        return 'New action item created'
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-6">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={`${activity.type}-${activity.id}-${index}`} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">
                  {getActivityText(activity.type, activity.status)} • {new Date(activity.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

