'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { AlertOctagon, AlertTriangle, AlertCircle } from 'lucide-react'
import { apiJson } from '../utils/api'

interface PriorityData {
  name: string
  value: number
  color: string
  icon: React.ReactNode
}

interface ActionItemStats {
  total: number
  pending: number
  in_progress: number
  completed: number
  cancelled: number
  high_priority: number
  medium_priority: number
  low_priority: number
}

interface PriorityChartProps {
  className?: string
}

export default function PriorityChart({ className = '' }: PriorityChartProps) {
  const [data, setData] = useState<PriorityData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPriorityData()
  }, [])

  const fetchPriorityData = async () => {
    try {
      setIsLoading(true)
      const stats = await apiJson<ActionItemStats>('/action-items/stats/overview')
      
      const chartData: PriorityData[] = [
        {
          name: 'High Priority',
          value: stats.high_priority || 0,
          color: '#EF4444', // Red
          icon: <AlertOctagon className="w-4 h-4" />
        },
        {
          name: 'Medium Priority',
          value: stats.medium_priority || 0,
          color: '#F59E0B', // Amber
          icon: <AlertTriangle className="w-4 h-4" />
        },
        {
          name: 'Low Priority',
          value: stats.low_priority || 0,
          color: '#10B981', // Green
          icon: <AlertCircle className="w-4 h-4" />
        }
      ]
      
      setData(chartData)
    } catch (error) {
      console.error('Error fetching priority data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalTasks = data.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = totalTasks > 0 ? ((data.value / totalTasks) * 100).toFixed(1) : 0
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} tasks ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className={`card ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (totalTasks === 0) {
    return (
      <div className={`card ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">📊</span>
            </div>
            <p>No tasks available</p>
            <p className="text-sm">Create some action items to see the chart</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }}>
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item) => {
          const percentage = totalTasks > 0 ? ((item.value / totalTasks) * 100).toFixed(1) : 0
          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {item.value}
                </span>
                <span className="text-xs text-gray-500">
                  ({percentage}%)
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
