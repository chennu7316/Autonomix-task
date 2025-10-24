'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  CheckSquare, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  Calendar
} from 'lucide-react'
import StatsCard from './StatsCard'
import RecentActivity from './RecentActivity'
import ActionItemsChart from './ActionItemsChart'
import TaskStatusChart from './TaskStatusChart'
import PriorityChart from './PriorityChart'
import { apiJson } from '../utils/api'

interface DashboardStats {
  totalTranscripts: number
  totalActionItems: number
  completedActionItems: number
  pendingActionItems: number
  inProgressActionItems: number
  completionRate: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTranscripts: 0,
    totalActionItems: 0,
    completedActionItems: 0,
    pendingActionItems: 0,
    inProgressActionItems: 0,
    completionRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const data = await apiJson<DashboardStats>('/dashboard/stats')
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Transcripts"
          value={stats.totalTranscripts}
          icon={FileText}
          color="blue"
          change="+12%"
        />
        <StatsCard
          title="Action Items"
          value={stats.totalActionItems}
          icon={CheckSquare}
          color="green"
          change="+8%"
        />
        <StatsCard
          title="Completed"
          value={stats.completedActionItems}
          icon={TrendingUp}
          color="emerald"
          change={`${stats.completionRate}%`}
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgressActionItems}
          icon={Clock}
          color="yellow"
          change="+5%"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionItemsChart />
        <TaskStatusChart />
      </div>

      {/* Priority and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityChart />
        <RecentActivity />
      </div>

    </div>
  )
}
