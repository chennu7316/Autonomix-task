'use client'

import { useState, useEffect } from 'react'
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar,
  Filter,
  Plus,
  Trash2,
  AlertCircle,
  AlertOctagon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { apiJson } from '../utils/api'

interface ActionItem {
  id: number
  title: string
  description: string
  assignee: string
  due_date: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  transcript_title: string
  created_at: string
}

export default function ActionItemsList() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [keywordFilter, setKeywordFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    assignee: '',
    due_date: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  })

  useEffect(() => {
    fetchActionItems()
  }, [])

  const fetchActionItems = async () => {
    setIsLoading(true)
    try {
      const data = await apiJson<ActionItem[]>('/action-items')
      setActionItems(data)
    } catch (error) {
      console.error('Error fetching action items:', error)
      toast.error('Failed to fetch action items')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      await apiJson(`/action-items/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      toast.success('Status updated successfully')
      fetchActionItems()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const deleteActionItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this action item?')) {
      return
    }

    try {
      await apiJson(`/action-items/${id}`, {
        method: 'DELETE',
      })
      toast.success('Action item deleted successfully')
      fetchActionItems()
    } catch (error) {
      console.error('Error deleting action item:', error)
      toast.error('Failed to delete action item')
    }
  }

  const createActionItem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await apiJson('/action-items', {
        method: 'POST',
        body: JSON.stringify(newItem),
      })
      toast.success('Action item created successfully')
      setNewItem({ title: '', description: '', assignee: '', due_date: '', priority: 'medium' })
      setShowCreateForm(false)
      fetchActionItems()
    } catch (error) {
      console.error('Error creating action item:', error)
      toast.error('Failed to create action item')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckSquare className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'priority-high'
      case 'medium':
        return 'priority-medium'
      case 'low':
        return 'priority-low'
      default:
        return 'priority-medium'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertOctagon className="w-4 h-4" />
      case 'medium':
        return <AlertTriangle className="w-4 h-4" />
      case 'low':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const filteredItems = actionItems.filter(item => {
    // Status filter
    const statusMatch = filter === 'all' || item.status === filter
    
    // Priority filter
    const priorityMatch = priorityFilter === 'all' || item.priority === priorityFilter
    
    // Keyword filter (search in title, description, and assignee)
    const keywordMatch = keywordFilter === '' || 
      item.title.toLowerCase().includes(keywordFilter.toLowerCase()) ||
      item.description.toLowerCase().includes(keywordFilter.toLowerCase()) ||
      item.assignee.toLowerCase().includes(keywordFilter.toLowerCase())
    
    return statusMatch && priorityMatch && keywordMatch
  }).sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
        break
      case 'status':
        const statusOrder = { completed: 4, in_progress: 3, pending: 2, cancelled: 1 }
        comparison = statusOrder[a.status] - statusOrder[b.status]
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'assignee':
        comparison = a.assignee.localeCompare(b.assignee)
        break
      default:
        comparison = 0
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Action Items</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Action Item</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex space-x-2">
              {['all', 'pending', 'in_progress', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Priority:</span>
            <div className="flex space-x-2">
              {['all', 'high', 'medium', 'low'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    priorityFilter === priority
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Keyword Search */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Search:</span>
            <input
              type="text"
              placeholder="Search by title, description, or assignee..."
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              className="flex-1 input-field"
            />
            {keywordFilter && (
              <button
                onClick={() => setKeywordFilter('')}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sorting Controls */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="created_at">Creation Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
              <option value="assignee">Assignee</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
              <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>
          </div>

          {/* Active Filters Summary */}
          {(filter !== 'all' || priorityFilter !== 'all' || keywordFilter) && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Active filters:</span>
              {filter !== 'all' && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                  Status: {filter.replace('_', ' ')}
                </span>
              )}
              {priorityFilter !== 'all' && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                  Priority: {priorityFilter}
                </span>
              )}
              {keywordFilter && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                  Search: "{keywordFilter}"
                </span>
              )}
              <button
                onClick={() => {
                  setFilter('all')
                  setPriorityFilter('all')
                  setKeywordFilter('')
                  setSortBy('created_at')
                  setSortOrder('desc')
                }}
                className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Action Item</h3>
            <form onSubmit={createActionItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="input-field"
                  placeholder="Action item title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Detailed description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <input
                    type="text"
                    value={newItem.assignee}
                    onChange={(e) => setNewItem({ ...newItem, assignee: e.target.value })}
                    className="input-field"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as 'high' | 'medium' | 'low' })}
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newItem.due_date}
                  onChange={(e) => setNewItem({ ...newItem, due_date: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Items List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="card text-center py-8">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No action items found</p>
            <p className="text-sm text-gray-400">Create your first action item or upload a transcript</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(item.status)}
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {getPriorityIcon(item.priority)}
                      <span className="capitalize">{item.priority}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {item.assignee && (
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{item.assignee}</span>
                      </div>
                    )}
                    {item.due_date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-400">
                      From: {item.transcript_title}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => deleteActionItem(item.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Delete action item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
