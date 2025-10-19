/**
 * AI Content Summarization API
 * Generates intelligent summaries based on user preferences and reading level
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_BASE_URL = 'https://api.openai.com/v1'

interface SummarizationRequest {
  content: string
  title: string
  style: 'concise' | 'detailed' | 'comprehensive'
  readingLevel: 'beginner' | 'intermediate' | 'advanced'
}

interface SummarizationResponse {
  summary: string
  excerpt: string
  keyPoints: string[]
  readingTime: string
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
    const body: SummarizationRequest = await request.json()
    const { content, title, style, readingLevel } = body

    if (!content || !title) {
      return NextResponse.json({ error: 'Content and title are required' }, { status: 400 })
    }

    console.log('📄 Generating summary for:', title)

    // Create summarization prompt based on style and reading level
    const summarizationPrompt = createSummarizationPrompt(content, title, style, readingLevel)

    // Call OpenAI API for content summarization
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
            content: 'You are an expert content summarizer specializing in AI and technology news. Create clear, engaging summaries tailored to the user\'s reading level and preferences.'
          },
          {
            role: 'user',
            content: summarizationPrompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1500
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const summaryText = openaiData.choices[0]?.message?.content

    if (!summaryText) {
      throw new Error('No summary response from OpenAI')
    }

    // Parse the structured response from OpenAI
    let summaryResult: SummarizationResponse
    try {
      // Extract JSON from the response
      const jsonMatch = summaryText.match(/```json\n([\s\S]*?)\n```/) || summaryText.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : summaryText
      summaryResult = JSON.parse(jsonString)
    } catch {
      console.error('Failed to parse OpenAI response:', summaryText)
      // Fallback to basic summarization
      summaryResult = createFallbackSummary(content, title, style, readingLevel)
    }

    console.log('✅ Content summarization completed')

    return NextResponse.json(summaryResult)

  } catch (error) {
    console.error('❌ Content summarization failed:', error)
    
    // Return fallback summary on error
    const body = await request.json()
    const fallbackSummary = createFallbackSummary(body.content, body.title, body.style, body.readingLevel)
    
    return NextResponse.json(fallbackSummary)
  }
}

/**
 * Create summarization prompt based on style and reading level
 */
function createSummarizationPrompt(
  content: string, 
  title: string, 
  style: string, 
  readingLevel: string
): string {
  const styleInstructions = {
    concise: 'Create a concise summary (2-3 sentences) that captures the essential information.',
    detailed: 'Create a detailed summary (4-6 sentences) that provides comprehensive coverage.',
    comprehensive: 'Create a comprehensive summary (6-8 sentences) that covers all important aspects.'
  }

  const levelInstructions = {
    beginner: 'Use simple language and explain technical terms. Focus on practical implications.',
    intermediate: 'Use moderate technical language with some explanations. Balance technical depth with accessibility.',
    advanced: 'Use technical language and assume familiarity with AI/ML concepts. Focus on technical details and implications.'
  }

  return `
Summarize the following AI/tech content and return a JSON response with this structure:

{
  "summary": "string (main summary text)",
  "excerpt": "string (short excerpt for previews)",
  "keyPoints": ["array", "of", "key", "points"],
  "readingTime": "string (e.g., '3 min read')"
}

Content to summarize:
Title: ${title}
Content: ${content.substring(0, 3000)}...

Instructions:
- Style: ${styleInstructions[style as keyof typeof styleInstructions]}
- Reading Level: ${levelInstructions[readingLevel as keyof typeof levelInstructions]}
- Focus on the most important and interesting aspects
- Make it engaging and informative
- Include practical implications when relevant
- Extract 3-5 key points that readers should know

Return only the JSON object, no additional text.
`
}

/**
 * Create fallback summary when AI summarization fails
 */
function createFallbackSummary(
  content: string, 
  title: string, 
  _style: string, 
  _readingLevel: string
): SummarizationResponse {
  // Basic summarization logic
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  const keySentences = sentences.slice(0, 3)
  
  let summary = keySentences.join('. ').trim()
  if (summary && !summary.endsWith('.')) {
    summary += '.'
  }

  // Create excerpt (first 150 characters)
  const excerpt = content.substring(0, 150).trim()
  const lastSpace = excerpt.lastIndexOf(' ')
  const cleanExcerpt = lastSpace > 0 ? excerpt.substring(0, lastSpace) + '...' : excerpt + '...'

  // Extract key points (simple keyword extraction)
  const keyPoints = extractKeyPoints(content, title)

  // Calculate reading time
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200) // 200 words per minute

  return {
    summary: summary || content.substring(0, 200) + '...',
    excerpt: cleanExcerpt,
    keyPoints,
    readingTime: `${readingTime} min read`
  }
}

/**
 * Extract key points from content
 */
function extractKeyPoints(content: string, title: string): string[] {
  const _text = (content + ' ' + title).toLowerCase()
  
  // Look for sentences that contain important keywords
  const importantKeywords = [
    'breakthrough', 'innovation', 'development', 'improvement', 'advancement',
    'new', 'latest', 'first', 'significant', 'important', 'key', 'major'
  ]
  
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30)
  const keySentences = sentences.filter(sentence => 
    importantKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
  )
  
  // Return top 3-5 key points
  return keySentences
    .slice(0, 5)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => s.length > 100 ? s.substring(0, 100) + '...' : s)
}
