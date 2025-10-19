/**
 * Async Refresh API Endpoint
 * Queues agentic workflow jobs for background processing
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, User } from '@/lib/auth'
import { redisQueueService } from '@/lib/redis-queue-service'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const tokenData = await verifyToken(token)
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Parse request body for configuration
    const body = await request.json()
    const config = body.config || {
      maxResults: 15,
      searchDepth: 'medium',
      personalizationLevel: 'advanced',
      summarizationStyle: 'detailed',
      includeImages: true,
      includeVideos: false
    }

    console.log('🔄 Queuing refresh workflow for user:', tokenData.email)

    // Queue the job for background processing with Redis
    const jobId = await redisQueueService.addJob(tokenData.userId, config)

    return NextResponse.json({
      success: true,
      message: 'Refresh job queued successfully',
      jobId,
      status: 'queued',
      estimatedTime: '30-60 seconds',
      metadata: {
        userId: tokenData.userId,
        timestamp: new Date().toISOString(),
        config
      }
    })

  } catch (error) {
    console.error('❌ Failed to queue refresh job:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to queue job',
      message: 'Failed to start refresh process'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const tokenData = await verifyToken(token)
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get job status from query params
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 })
    }

    // Get job status from Redis
    const job = await redisQueueService.getJobStatus(jobId)

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        result: job.result,
        error: job.error
      }
    })

  } catch (error) {
    console.error('❌ Failed to get job status:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get job status'
    }, { status: 500 })
  }
}
