/**
 * Tavily Search API Integration
 * Handles intelligent web searches using Tavily API
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Tavily API configuration
const TAVILY_API_KEY = process.env.TAVILY_API_KEY
const TAVILY_BASE_URL = 'https://api.tavily.com'

interface TavilySearchRequest {
  query: string
  search_depth: 'basic' | 'advanced'
  include_images: boolean
  max_results: number
  include_domains?: string[]
  exclude_domains?: string[]
}

interface TavilySearchResponse {
  results: Array<{
    title: string
    url: string
    content: string
    score: number
    published_date?: string
    image?: string
  }>
  answer?: string
  query: string
  follow_up_questions?: string[]
}

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

    if (!TAVILY_API_KEY) {
      return NextResponse.json({ error: 'Tavily API key not configured' }, { status: 500 })
    }

    // Parse request body
    const body = await request.json()
    const { 
      query, 
      searchDepth = 'advanced', 
      includeImages = true, 
      maxResults = 5,
      includeDomains,
      excludeDomains 
    } = body

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    console.log('🔍 Executing Tavily search for query:', query)

    // Prepare Tavily search request
    const tavilyRequest: TavilySearchRequest = {
      query,
      search_depth: searchDepth,
      include_images: includeImages,
      max_results: maxResults,
      ...(includeDomains && { include_domains: includeDomains }),
      ...(excludeDomains && { exclude_domains: excludeDomains })
    }

    // Execute search with Tavily API
    const tavilyResponse = await fetch(`${TAVILY_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TAVILY_API_KEY}`
      },
      body: JSON.stringify(tavilyRequest)
    })

    if (!tavilyResponse.ok) {
      const errorData = await tavilyResponse.json()
      throw new Error(`Tavily API error: ${errorData.detail || tavilyResponse.statusText}`)
    }

    const tavilyData: TavilySearchResponse = await tavilyResponse.json()

    // Transform Tavily results to our format
    const transformedResults = tavilyData.results.map(result => ({
      title: result.title,
      url: result.url,
      content: result.content,
      score: result.score,
      source: extractSourceFromUrl(result.url),
      timestamp: result.published_date || new Date().toISOString(),
      image: result.image,
      excerpt: generateExcerpt(result.content)
    }))

    console.log('✅ Tavily search completed:', transformedResults.length, 'results')

    return NextResponse.json({
      success: true,
      results: transformedResults,
      metadata: {
        query,
        totalResults: transformedResults.length,
        answer: tavilyData.answer,
        followUpQuestions: tavilyData.follow_up_questions
      }
    })

  } catch (error) {
    console.error('❌ Tavily search failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Search failed'
    }, { status: 500 })
  }
}

/**
 * Extract source name from URL
 */
function extractSourceFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname
    
    // Remove www. prefix
    const cleanHostname = hostname.replace(/^www\./, '')
    
    // Extract domain name (e.g., techcrunch.com -> TechCrunch)
    const parts = cleanHostname.split('.')
    const domain = parts[0]
    
    // Capitalize first letter
    return domain.charAt(0).toUpperCase() + domain.slice(1)
  } catch {
    return 'Unknown Source'
  }
}

/**
 * Generate excerpt from content
 */
function generateExcerpt(content: string, maxLength: number = 150): string {
  if (content.length <= maxLength) return content
  
  const excerpt = content.substring(0, maxLength)
  const lastSpace = excerpt.lastIndexOf(' ')
  
  return lastSpace > 0 ? excerpt.substring(0, lastSpace) + '...' : excerpt + '...'
}
