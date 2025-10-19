/**
 * Custom hook for managing the refresh workflow
 * Handles async job queuing and status polling
 */

import { useState, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface RefreshState {
  isRefreshing: boolean
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'error'
  message: string
  jobId?: string
  results?: unknown[]
  error?: string
}

export function useRefreshWorkflow() {
  const { user, token } = useAuth()
  const [state, setState] = useState<RefreshState>({
    isRefreshing: false,
    status: 'idle',
    message: ''
  })
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startPolling = useCallback((jobId: string) => {
    // Clear any existing polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }

    // Poll every 2 seconds
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/refresh-async?jobId=${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.status === 'completed') {
          // Clear polling
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }

          setState(prev => ({
            ...prev,
            isRefreshing: false,
            status: 'completed',
            message: '✅ Workflow completed successfully!',
            results: data.results
          }))
        } else if (data.status === 'failed') {
          // Clear polling
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }

          setState(prev => ({
            ...prev,
            isRefreshing: false,
            status: 'error',
            message: '❌ Workflow failed',
            error: data.error
          }))
        } else {
          // Update status
          setState(prev => ({
            ...prev,
            status: data.status === 'processing' ? 'processing' : 'queued',
            message: data.message || prev.message
          }))
        }
      } catch (error) {
        console.error('Polling error:', error)
        // Clear polling on error
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
          pollIntervalRef.current = null
        }

        setState(prev => ({
          ...prev,
          isRefreshing: false,
          status: 'error',
          message: '❌ Failed to check job status',
          error: error instanceof Error ? error.message : 'Unknown error'
        }))
      }
    }, 2000)
  }, [token])

  const startRefresh = useCallback(async () => {
    if (!user || !token) {
      console.error('User not authenticated')
      return
    }

    setState({
      isRefreshing: true,
      status: 'queued',
      message: '🤖 Queuing intelligent search workflow...'
    })

    try {
      // Queue the job
      const response = await fetch('/api/refresh-async', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          config: {
            maxResults: 15,
            searchDepth: 'medium',
            personalizationLevel: 'advanced',
            summarizationStyle: 'detailed',
            includeImages: true,
            includeVideos: false
          }
        })
      })

      const data = await response.json()

      if (data.success && data.jobId) {
        setState(prev => ({
          ...prev,
          jobId: data.jobId,
          status: 'queued',
          message: '🔄 Workflow queued in Redis. Processing with parallel workers...'
        }))

        // Start polling for job status
        startPolling(data.jobId)
      } else {
        throw new Error(data.error || 'Failed to queue job')
      }
    } catch (error) {
      console.error('Refresh failed:', error)
      setState({
        isRefreshing: false,
        status: 'error',
        message: '❌ Failed to start refresh workflow',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }, [user, token, startPolling])

  const stopRefresh = useCallback(() => {
    setState({
      isRefreshing: false,
      status: 'idle',
      message: ''
    })

    // Clear polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [])

  return {
    ...state,
    startRefresh,
    stopRefresh
  }
}
