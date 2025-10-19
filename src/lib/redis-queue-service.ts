/**
 * Redis-based Queue Service for High-Volume Processing
 * Handles thousands of concurrent requests with proper queuing
 */

import Redis from 'ioredis'

interface QueueJob {
  id: string
  userId: string
  config: unknown
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
  result?: unknown
  error?: string
}

class RedisQueueService {
  private redis: Redis
  private processing = false
  private maxConcurrentJobs = 10 // Process max 10 jobs simultaneously

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    })
  }

  /**
   * Add job to queue (handles 1000+ concurrent requests)
   */
  async addJob(userId: string, config: unknown): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const job: QueueJob = {
      id: jobId,
      userId,
      config,
      status: 'pending',
      createdAt: new Date()
    }

    // Store job in Redis
    await this.redis.hset(`job:${jobId}`, {
      id: jobId,
      userId,
      config: JSON.stringify(config),
      status: 'pending',
      createdAt: job.createdAt.toISOString()
    })

    // Add to processing queue
    await this.redis.lpush('job_queue', jobId)
    
    // Trigger processing if not already running
    if (!this.processing) {
      this.processQueue()
    }

    return jobId
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<QueueJob | null> {
    const jobData = await this.redis.hgetall(`job:${jobId}`)
    
    if (!jobData.id) return null

    return {
      id: jobData.id,
      userId: jobData.userId,
      config: JSON.parse(jobData.config || '{}'),
      status: jobData.status as any,
      createdAt: new Date(jobData.createdAt),
      completedAt: jobData.completedAt ? new Date(jobData.completedAt) : undefined,
      result: jobData.result ? JSON.parse(jobData.result) : undefined,
      error: jobData.error
    }
  }

  /**
   * Process queue with parallel workers
   */
  private async processQueue() {
    this.processing = true

    // Start multiple workers for parallel processing
    const workers = Array.from({ length: this.maxConcurrentJobs }, (_, i) => 
      this.createWorker(`worker-${i}`)
    )

    // Wait for all workers to complete
    await Promise.all(workers)
    
    this.processing = false
  }

  /**
   * Create a worker that processes jobs in parallel
   */
  private async createWorker(workerId: string) {
    console.log(`🚀 Starting worker: ${workerId}`)

    while (true) {
      try {
        // Get next job from queue (blocking pop with timeout)
        const jobId = await this.redis.brpop('job_queue', 5)
        
        if (!jobId) {
          // No more jobs, worker can exit
          console.log(`💤 Worker ${workerId} idle, exiting`)
          break
        }

        const actualJobId = jobId[1]
        console.log(`⚡ Worker ${workerId} processing job: ${actualJobId}`)

        // Process the job
        await this.processJob(actualJobId, workerId)

      } catch (error) {
        console.error(`❌ Worker ${workerId} error:`, error)
        // Continue processing other jobs
      }
    }
  }

  /**
   * Process a single job
   */
  private async processJob(jobId: string, workerId: string) {
    try {
      // Update job status to processing
      await this.redis.hset(`job:${jobId}`, {
        status: 'processing',
        workerId
      })

      // Get job data
      const jobData = await this.redis.hgetall(`job:${jobId}`)
      const config = JSON.parse(jobData.config)

      // Trigger N8n workflow
      const result = await this.triggerN8nWorkflow(jobId, config)
      
      // Update job with result
      await this.redis.hset(`job:${jobId}`, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        result: JSON.stringify(result)
      })

      console.log(`✅ Worker ${workerId} completed job: ${jobId}`)

    } catch (error) {
      console.error(`❌ Job ${jobId} failed:`, error)
      
      // Update job with error
      await this.redis.hset(`job:${jobId}`, {
        status: 'failed',
        completedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Trigger N8n workflow
   */
  private async triggerN8nWorkflow(jobId: string, config: unknown): Promise<unknown> {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    const n8nApiKey = process.env.N8N_API_KEY

    if (!n8nWebhookUrl) {
      throw new Error('N8n webhook URL not configured')
    }

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(n8nApiKey && { 'Authorization': `Bearer ${n8nApiKey}` })
      },
      body: JSON.stringify({
        jobId,
        config,
        timestamp: new Date().toISOString()
      })
    })

    if (!response.ok) {
      throw new Error(`N8n workflow failed: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    const queueLength = await this.redis.llen('job_queue')
    const processingJobs = await this.redis.keys('job:processing:*')
    
    return {
      queueLength,
      processingJobs: processingJobs.length,
      maxConcurrentJobs: this.maxConcurrentJobs
    }
  }

  /**
   * Clean up old jobs
   */
  async cleanup() {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
    const allJobs = await this.redis.keys('job:*')
    
    for (const jobKey of allJobs) {
      const jobData = await this.redis.hgetall(jobKey)
      const createdAt = new Date(jobData.createdAt)
      
      if (createdAt < cutoffTime) {
        await this.redis.del(jobKey)
      }
    }
  }
}

// Singleton instance
export const redisQueueService = new RedisQueueService()

// Cleanup old jobs every hour
setInterval(() => {
  redisQueueService.cleanup()
}, 60 * 60 * 1000)
