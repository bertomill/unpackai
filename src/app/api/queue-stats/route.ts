/**
 * Queue Statistics API
 * Provides monitoring data for the Redis queue system
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { redisQueueService } from '@/lib/redis-queue-service'

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

    // Get queue statistics
    const stats = await redisQueueService.getQueueStats()

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        timestamp: new Date().toISOString(),
        health: stats.queueLength < 100 ? 'healthy' : 'overloaded'
      }
    })

  } catch (error) {
    console.error('❌ Failed to get queue stats:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get queue stats'
    }, { status: 500 })
  }
}
