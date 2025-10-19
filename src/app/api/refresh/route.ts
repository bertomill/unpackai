/**
 * Refresh App API Endpoint
 * Triggers the agentic workflow to fetch fresh, personalized AI news
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, User } from '@/lib/auth'
import { executeAgenticWorkflow } from '@/lib/agentic-workflow'

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

    console.log('🔄 Starting refresh workflow for user:', tokenData.email)

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

    // Create a User object for the workflow
    const user: User = {
      id: tokenData.userId,
      email: tokenData.email,
      name: tokenData.email.split('@')[0] // Use email prefix as name
    }

    // Execute the agentic workflow
    const results = await executeAgenticWorkflow(user, config)

    console.log('✅ Refresh workflow completed successfully')

    return NextResponse.json({
      success: true,
      message: 'App refreshed successfully',
      results,
      metadata: {
        totalResults: results.length,
        executionTime: Date.now(),
        user: user.name,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Refresh workflow failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Refresh failed',
      message: 'Failed to refresh app content'
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

    // Return refresh status and configuration
    return NextResponse.json({
      success: true,
      message: 'Refresh endpoint ready',
      user: tokenData.email,
      timestamp: new Date().toISOString(),
      capabilities: {
        agenticWorkflow: true,
        tavilySearch: !!process.env.TAVILY_API_KEY,
        openaiAnalysis: !!process.env.OPENAI_API_KEY,
        personalization: true
      }
    })

  } catch (error) {
    console.error('❌ Refresh status check failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Status check failed'
    }, { status: 500 })
  }
}
