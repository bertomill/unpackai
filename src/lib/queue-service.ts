/**
 * Queue Service for Agentic Workflow
 * Handles job queuing and background processing
 */

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

class QueueService {
  private jobs: Map<string, QueueJob> = new Map()
  private processing = false

  /**
   * Add a new job to the queue
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

    this.jobs.set(jobId, job)
    
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
    return this.jobs.get(jobId) || null
  }

  /**
   * Process the queue
   */
  private async processQueue() {
    this.processing = true

    while (true) {
      const pendingJobs = Array.from(this.jobs.values())
        .filter(job => job.status === 'pending')
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

      if (pendingJobs.length === 0) {
        this.processing = false
        break
      }

      const job = pendingJobs[0]
      await this.processJob(job)
    }
  }

  /**
   * Process a single job
   */
  private async processJob(job: QueueJob) {
    try {
      // Update job status
      job.status = 'processing'
      this.jobs.set(job.id, job)

      // Trigger N8n workflow
      const result = await this.triggerN8nWorkflow(job)
      
      // Update job with result
      job.status = 'completed'
      job.completedAt = new Date()
      job.result = result
      this.jobs.set(job.id, job)

    } catch (error) {
      // Handle job failure
      job.status = 'failed'
      job.completedAt = new Date()
      job.error = error instanceof Error ? error.message : 'Unknown error'
      this.jobs.set(job.id, job)
    }
  }

  /**
   * Trigger N8n workflow
   */
  private async triggerN8nWorkflow(job: QueueJob): Promise<unknown> {
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
        jobId: job.id,
        userId: job.userId,
        config: job.config,
        timestamp: new Date().toISOString()
      })
    })

    if (!response.ok) {
      throw new Error(`N8n workflow failed: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Clean up old jobs (keep last 100)
   */
  cleanup() {
    const jobs = Array.from(this.jobs.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(100)

    jobs.forEach(job => {
      this.jobs.delete(job.id)
    })
  }
}

// Singleton instance
export const queueService = new QueueService()

// Cleanup old jobs every hour
setInterval(() => {
  queueService.cleanup()
}, 60 * 60 * 1000)
