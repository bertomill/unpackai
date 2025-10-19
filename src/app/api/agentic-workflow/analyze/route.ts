/**
 * AI Content Analysis API
 * Analyzes content for relevance, credibility, recency, and engagement
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_BASE_URL = 'https://api.openai.com/v1'

interface ContentAnalysisRequest {
  content: string
  title: string
  url: string
  source: string
}

interface ContentAnalysisResponse {
  category: string
  tags: string[]
  analysis: {
    relevance: number
    credibility: number
    recency: number
    engagement: number
    personalization: number
    overallScore: number
  }
  trending: boolean
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

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Parse request body
    const body: ContentAnalysisRequest = await request.json()
    const { content, title, source } = body

    if (!content || !title) {
      return NextResponse.json({ error: 'Content and title are required' }, { status: 400 })
    }

    console.log('🧠 Analyzing content:', title)

    // Create analysis prompt
    const analysisPrompt = createAnalysisPrompt(content, title, source)

    // Call OpenAI API for content analysis
    const openaiResponse = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI content analyst. Analyze the provided content and return a JSON response with the required analysis metrics.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const analysisText = openaiData.choices[0]?.message?.content

    if (!analysisText) {
      throw new Error('No analysis response from OpenAI')
    }

    // Parse the JSON response from OpenAI
    let analysisResult: ContentAnalysisResponse
    try {
      // Extract JSON from the response (in case it's wrapped in markdown)
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || analysisText.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : analysisText
      analysisResult = JSON.parse(jsonString)
    } catch {
      console.error('Failed to parse OpenAI response:', analysisText)
      // Fallback to basic analysis
      analysisResult = createFallbackAnalysis(content, title, source)
    }

    console.log('✅ Content analysis completed')

    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error('❌ Content analysis failed:', error)
    
    // Return fallback analysis on error
    const body = await request.json()
    const fallbackAnalysis = createFallbackAnalysis(body.content, body.title, body.source)
    
    return NextResponse.json(fallbackAnalysis)
  }
}

/**
 * Create analysis prompt for OpenAI
 */
function createAnalysisPrompt(content: string, title: string, source: string): string {
  return `
Analyze the following AI/tech content and provide a JSON response with the following structure:

{
  "category": "string (e.g., 'AI Research', 'Tech News', 'Industry Update')",
  "tags": ["array", "of", "relevant", "tags"],
  "analysis": {
    "relevance": 0.0-1.0,
    "credibility": 0.0-1.0,
    "recency": 0.0-1.0,
    "engagement": 0.0-1.0,
    "personalization": 0.0-1.0,
    "overallScore": 0.0-1.0
  },
  "trending": boolean
}

Content to analyze:
Title: ${title}
Source: ${source}
Content: ${content.substring(0, 2000)}...

Analysis criteria:
- relevance: How relevant is this to AI/tech enthusiasts (0-1)
- credibility: How trustworthy is the source and content (0-1)
- recency: How recent and timely is this information (0-1)
- engagement: How likely is this to engage readers (0-1)
- personalization: How well does this match typical AI enthusiast interests (0-1)
- overallScore: Weighted average of all metrics
- trending: Is this likely to be trending or viral content

Return only the JSON object, no additional text.
`
}

/**
 * Create fallback analysis when AI analysis fails
 */
function createFallbackAnalysis(content: string, title: string, source: string): ContentAnalysisResponse {
  // Basic heuristics for fallback analysis
  const isRecent = isContentRecent(content)
  const isRelevant = isContentRelevant(content, title)
  const isCredible = isSourceCredible(source)
  const isEngaging = isContentEngaging(content, title)
  
  const overallScore = (isRecent + isRelevant + isCredible + isEngaging) / 4

  return {
    category: categorizeContent(content, title),
    tags: extractTags(content, title),
    analysis: {
      relevance: isRelevant,
      credibility: isCredible,
      recency: isRecent,
      engagement: isEngaging,
      personalization: 0.5, // Default personalization score
      overallScore
    },
    trending: isTrendingContent(content, title)
  }
}

/**
 * Check if content is recent
 */
function isContentRecent(content: string): number {
  const recentKeywords = ['today', 'yesterday', 'this week', 'recently', 'latest', 'new', '2024']
  const hasRecentKeywords = recentKeywords.some(keyword => 
    content.toLowerCase().includes(keyword)
  )
  
  return hasRecentKeywords ? 0.8 : 0.5
}

/**
 * Check if content is relevant to AI/tech
 */
function isContentRelevant(content: string, title: string): number {
  const aiKeywords = [
    'artificial intelligence', 'machine learning', 'AI', 'ML', 'neural network',
    'deep learning', 'GPT', 'ChatGPT', 'OpenAI', 'Google', 'Microsoft',
    'algorithm', 'data science', 'automation', 'robotics'
  ]
  
  const text = (content + ' ' + title).toLowerCase()
  const keywordCount = aiKeywords.filter(keyword => text.includes(keyword)).length
  
  return Math.min(keywordCount / 5, 1.0) // Normalize to 0-1
}

/**
 * Check if source is credible
 */
function isSourceCredible(source: string): number {
  const credibleSources = [
    'techcrunch', 'theverge', 'wired', 'arstechnica', 'openai', 'google',
    'microsoft', 'nvidia', 'anthropic', 'huggingface', 'arxiv'
  ]
  
  const sourceLower = source.toLowerCase()
  const isCredible = credibleSources.some(credible => sourceLower.includes(credible))
  
  return isCredible ? 0.9 : 0.6
}

/**
 * Check if content is engaging
 */
function isContentEngaging(content: string, title: string): number {
  const engagingKeywords = [
    'breakthrough', 'revolutionary', 'groundbreaking', 'innovative',
    'exciting', 'amazing', 'incredible', 'stunning', 'remarkable'
  ]
  
  const text = (content + ' ' + title).toLowerCase()
  const hasEngagingKeywords = engagingKeywords.some(keyword => text.includes(keyword))
  
  return hasEngagingKeywords ? 0.8 : 0.6
}

/**
 * Categorize content
 */
function categorizeContent(content: string, title: string): string {
  const text = (content + ' ' + title).toLowerCase()
  
  if (text.includes('research') || text.includes('study') || text.includes('paper')) {
    return 'AI Research'
  } else if (text.includes('business') || text.includes('enterprise') || text.includes('company')) {
    return 'Industry News'
  } else if (text.includes('product') || text.includes('release') || text.includes('launch')) {
    return 'Product Updates'
  } else {
    return 'AI News'
  }
}

/**
 * Extract tags from content
 */
function extractTags(content: string, title: string): string[] {
  const text = (content + ' ' + title).toLowerCase()
  const allTags = [
    'artificial intelligence', 'machine learning', 'deep learning', 'neural networks',
    'GPT', 'ChatGPT', 'OpenAI', 'Google', 'Microsoft', 'NVIDIA', 'Anthropic',
    'computer vision', 'natural language processing', 'robotics', 'automation',
    'data science', 'algorithm', 'AI safety', 'ethics', 'research'
  ]
  
  return allTags.filter(tag => text.includes(tag.toLowerCase()))
}

/**
 * Check if content is trending
 */
function isTrendingContent(content: string, title: string): boolean {
  const trendingKeywords = [
    'viral', 'trending', 'popular', 'hot', 'breaking', 'urgent',
    'must-read', 'essential', 'important', 'critical'
  ]
  
  const text = (content + ' ' + title).toLowerCase()
  return trendingKeywords.some(keyword => text.includes(keyword))
}
