/**
 * Main API endpoint for the agentic workflow
 * Handles the complete workflow execution including search, analysis, and personalization
 */

import { NextRequest, NextResponse } from 'next/server'
import { executeAgenticWorkflow } from '@/lib/agentic-workflow'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await verifyToken(token)
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Parse request body for workflow configuration
    const body = await request.json()
    const config = body.config || {}

    console.log('🚀 Starting agentic workflow for user:', user.name)

    // Execute the complete agentic workflow
    const results = await executeAgenticWorkflow(user, config)

    console.log('✅ Agentic workflow completed successfully')

    return NextResponse.json({
      success: true,
      results,
      metadata: {
        totalResults: results.length,
        executionTime: Date.now(),
        user: user.name,
        config
      }
    })

  } catch (error) {
    console.error('❌ Agentic workflow failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Workflow execution failed'
    }, { status: 500 })
  }
}
