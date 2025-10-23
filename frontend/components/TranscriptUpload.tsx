'use client'

import { useState } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import FileUpload from './FileUpload'
import { extractTextFromFile } from '@/utils/fileReader'

interface Transcript {
  id: number
  title: string
  content: string
  meeting_date: string
  participants: string
  created_at: string
  action_item_count: number
  completed_actions: number
}

export default function TranscriptUpload() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    meeting_date: '',
    participants: ''
  })

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setIsProcessingFile(true)

    try {
      const content = await extractTextFromFile(file)
      setFormData(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        content: content
      }))
      toast.success('File processed successfully!')
    } catch (error) {
      console.error('Error processing file:', error)
      toast.error('Failed to process file. Please try a different file or paste content manually.')
      setSelectedFile(null)
    } finally {
      setIsProcessingFile(false)
    }
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setFormData(prev => ({
      ...prev,
      title: '',
      content: ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transcripts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Transcript uploaded successfully! AI is generating action items...')
        setFormData({ title: '', content: '', meeting_date: '', participants: '' })
        setSelectedFile(null)
        fetchTranscripts()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to upload transcript')
      }
    } catch (error) {
      console.error('Error uploading transcript:', error)
      toast.error('Failed to upload transcript')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchTranscripts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transcripts`)
      if (response.ok) {
        const data = await response.json()
        setTranscripts(data)
      }
    } catch (error) {
      console.error('Error fetching transcripts:', error)
      toast.error('Failed to fetch transcripts')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Meeting Transcripts</h2>
        <button
          onClick={fetchTranscripts}
          className="btn-secondary"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Upload Form */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <Upload className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Upload New Transcript</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Transcript File
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              onRemove={handleFileRemove}
              selectedFile={selectedFile}
              isLoading={isProcessingFile}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                Upload a text file, PDF, or Word document, or paste content manually below.
              </p>
              <a
                href="/sample-transcript.txt"
                download="sample-transcript.txt"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Download sample file
              </a>
            </div>
          </div>

          {/* Manual Input Section */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Or Enter Details Manually</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Weekly Team Standup"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Date
                </label>
                <input
                  type="date"
                  value={formData.meeting_date}
                  onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participants
              </label>
              <input
                type="text"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                className="input-field"
                placeholder="e.g., John Doe, Jane Smith, Mike Johnson"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transcript Content *
              </label>
              <textarea
                required
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input-field"
                placeholder="Paste your meeting transcript here..."
              />
              <p className="text-sm text-gray-500 mt-1">
                The AI will analyze this content and generate actionable items automatically.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isProcessingFile}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Upload & Generate Action Items</span>
              )}
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span>Processing may take a few moments</span>
            </div>
          </div>
        </form>
      </div>

      {/* Transcripts List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transcripts</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : transcripts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transcripts uploaded yet</p>
            <p className="text-sm text-gray-400">Upload your first meeting transcript to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transcripts.map((transcript) => (
              <div key={transcript.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{transcript.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{new Date(transcript.created_at).toLocaleDateString()}</span>
                      <span>{transcript.participants}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {transcript.content.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>{transcript.completed_actions}/{transcript.action_item_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
