/**
 * Refresh Callback API
 * Handles responses from N8n workflow completion
 */

import { NextRequest, NextResponse } from 'next/server'
import { redisQueueService } from '@/lib/redis-queue-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobId, status, results, analysis, summaries, timestamp } = body

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 })
    }

    console.log('📥 Received callback for job:', jobId, 'Status:', status)

    // Get the job from Redis queue
    const job = await redisQueueService.getJobStatus(jobId)
    
    if (!job) {
      console.error('❌ Job not found:', jobId)
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (status === 'completed') {
      // Update job with results
      job.status = 'completed'
      job.completedAt = new Date()
      job.result = {
        results,
        analysis,
        summaries,
        timestamp
      }
      
      console.log('✅ Job completed successfully:', jobId)
    } else {
      // Handle error
      job.status = 'failed'
      job.completedAt = new Date()
      job.error = 'Workflow execution failed'
      
      console.error('❌ Job failed:', jobId)
    }

    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully',
      jobId,
      status
    })

  } catch (error) {
    console.error('❌ Callback processing failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Callback processing failed'
    }, { status: 500 })
  }
}
