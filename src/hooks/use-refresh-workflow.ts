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
  results?: any[]
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
  }, [user, token])

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

        const data = await response.json()

        if (data.success && data.job) {
          const { status, result, error } = data.job

          if (status === 'completed' && result) {
            // Job completed successfully
            setState(prev => ({
              ...prev,
              isRefreshing: false,
              status: 'completed',
              message: `✅ Found ${result.results?.length || 0} personalized articles!`,
              results: result.results
            }))

            // Clear polling
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current)
              pollIntervalRef.current = null
            }

            // Clear success message after 3 seconds
            setTimeout(() => {
              setState(prev => ({
                ...prev,
                status: 'idle',
                message: ''
              }))
            }, 3000)

          } else if (status === 'failed') {
            // Job failed
            setState(prev => ({
              ...prev,
              isRefreshing: false,
              status: 'error',
              message: '❌ Workflow failed to complete',
              error: error || 'Unknown error'
            }))

            // Clear polling
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current)
              pollIntervalRef.current = null
            }

            // Clear error message after 5 seconds
            setTimeout(() => {
              setState(prev => ({
                ...prev,
                status: 'idle',
                message: '',
                error: undefined
              }))
            }, 5000)

          } else if (status === 'processing') {
            // Job is processing
            setState(prev => ({
              ...prev,
              status: 'processing',
              message: '🧠 Analyzing content with AI...'
            }))
          }
        }
      } catch (error) {
        console.error('Polling failed:', error)
        setState(prev => ({
          ...prev,
          isRefreshing: false,
          status: 'error',
          message: '❌ Failed to check job status',
          error: error instanceof Error ? error.message : 'Unknown error'
        }))

        // Clear polling
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
          pollIntervalRef.current = null
        }
      }
    }, 2000)
  }, [token])

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
