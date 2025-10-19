/**
 * Agentic Workflow Engine for Intelligent AI News Aggregation
 * 
 * This module implements a sophisticated workflow that:
 * 1. Conducts targeted searches across key AI websites
 * 2. Aggregates and analyzes content using AI
 * 3. Personalizes results based on user preferences
 * 4. Provides intelligent summarization and ranking
 */

import { User } from '@/lib/auth'
import { getUserPreferences, generatePersonalizedQueries, calculatePersonalizationScore } from '@/lib/user-preferences'

// Key AI websites and sources for targeted searches
export const AI_SOURCES = {
  research: [
    'arxiv.org',
    'openai.com',
    'anthropic.com',
    'deepmind.com',
    'huggingface.co'
  ],
  news: [
    'techcrunch.com',
    'theverge.com',
    'wired.com',
    'venturebeat.com',
    'zdnet.com'
  ],
  community: [
    'reddit.com/r/MachineLearning',
    'reddit.com/r/artificial',
    'hackernews.com',
    'twitter.com',
    'linkedin.com'
  ],
  industry: [
    'openai.com/blog',
    'google.com/ai',
    'microsoft.com/ai',
    'nvidia.com/ai',
    'meta.com/ai'
  ]
} as const

// Search strategies for different content types
export const SEARCH_STRATEGIES = {
  breaking: {
    keywords: ['breaking', 'announcement', 'release', 'launch', 'new'],
    timeRange: '24h',
    priority: 'high'
  },
  research: {
    keywords: ['research', 'study', 'paper', 'findings', 'breakthrough'],
    timeRange: '7d',
    priority: 'medium'
  },
  industry: {
    keywords: ['enterprise', 'business', 'adoption', 'integration', 'partnership'],
    timeRange: '3d',
    priority: 'medium'
  },
  community: {
    keywords: ['discussion', 'opinion', 'analysis', 'review', 'comparison'],
    timeRange: '1d',
    priority: 'low'
  }
} as const

// User preference categories for personalization
export interface UserPreferences {
  interests: string[]
  readingLevel: 'beginner' | 'intermediate' | 'advanced'
  preferredSources: string[]
  topics: string[]
  timePreference: 'morning' | 'afternoon' | 'evening'
  readingTime: number // minutes per session
}

// Content analysis and ranking
export interface ContentAnalysis {
  relevance: number // 0-1
  credibility: number // 0-1
  recency: number // 0-1
  engagement: number // 0-1
  personalization: number // 0-1
  overallScore: number // 0-1
}

// Search result with enhanced metadata
export interface EnhancedSearchResult {
  title: string
  url: string
  content: string
  excerpt: string
  source: string
  timestamp: string
  category: string
  tags: string[]
  analysis: ContentAnalysis
  readTime: string
  trending: boolean
  image?: string
}

// Workflow configuration
export interface WorkflowConfig {
  maxResults: number
  searchDepth: 'shallow' | 'medium' | 'deep'
  personalizationLevel: 'basic' | 'advanced' | 'expert'
  summarizationStyle: 'concise' | 'detailed' | 'comprehensive'
  includeImages: boolean
  includeVideos: boolean
}

// Default workflow configuration
export const DEFAULT_WORKFLOW_CONFIG: WorkflowConfig = {
  maxResults: 20,
  searchDepth: 'medium',
  personalizationLevel: 'advanced',
  summarizationStyle: 'detailed',
  includeImages: true,
  includeVideos: false
}

/**
 * Main agentic workflow orchestrator
 */
export class AgenticWorkflow {
  private config: WorkflowConfig
  private user: User
  private userPreferences: UserPreferences

  constructor(user: User, config: WorkflowConfig = DEFAULT_WORKFLOW_CONFIG) {
    this.user = user
    this.config = config
    this.userPreferences = this.initializeUserPreferences()
  }

  /**
   * Initialize user preferences based on user data and defaults
   */
  private async initializeUserPreferences(): Promise<UserPreferences> {
    try {
      return await getUserPreferences(this.user.id)
    } catch (error) {
      console.error('Failed to load user preferences:', error)
      // Return intelligent defaults based on user profile
      return {
        interests: ['AI Research', 'Machine Learning', 'Tech News'],
        readingLevel: 'intermediate',
        preferredSources: ['TechCrunch', 'The Verge', 'OpenAI Blog'],
        topics: ['artificial intelligence', 'machine learning', 'neural networks'],
        timePreference: 'morning',
        readingTime: 15
      }
    }
  }

  /**
   * Execute the complete agentic workflow
   */
  async executeWorkflow(): Promise<EnhancedSearchResult[]> {
    console.log('🤖 Starting agentic workflow for user:', this.user.name)
    
    try {
      // Step 1: Generate intelligent search queries
      const searchQueries = await this.generateSearchQueries()
      console.log('📝 Generated search queries:', searchQueries.length)

      // Step 2: Execute parallel searches across different sources
      const searchResults = await this.executeParallelSearches(searchQueries)
      console.log('🔍 Completed searches, found:', searchResults.length, 'results')

      // Step 3: Analyze and rank content using AI
      const analyzedResults = await this.analyzeAndRankContent(searchResults)
      console.log('🧠 Analyzed and ranked content')

      // Step 4: Personalize results based on user preferences
      const personalizedResults = await this.personalizeResults(analyzedResults)
      console.log('👤 Personalized results for user preferences')

      // Step 5: Generate intelligent summaries
      const summarizedResults = await this.generateSummaries(personalizedResults)
      console.log('📄 Generated intelligent summaries')

      // Step 6: Final ranking and filtering
      const finalResults = this.finalRankingAndFiltering(summarizedResults)
      console.log('🎯 Final results ready:', finalResults.length)

      return finalResults

    } catch (error) {
      console.error('❌ Agentic workflow failed:', error)
      throw new Error(`Workflow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate intelligent search queries based on current trends and user preferences
   */
  private async generateSearchQueries(): Promise<string[]> {
    // Use the personalized query generation from user preferences
    const personalizedQueries = generatePersonalizedQueries(this.userPreferences)
    
    // Add current AI trends and topics
    const trendingTopics = [
      'GPT-5 latest updates',
      'Google Gemini new features',
      'OpenAI ChatGPT improvements',
      'AI safety research 2024',
      'Machine learning breakthroughs',
      'AI ethics and governance',
      'Autonomous systems advances',
      'Natural language processing',
      'Computer vision innovations',
      'AI in healthcare applications'
    ]

    // Combine personalized and trending queries
    const allQueries = [...personalizedQueries, ...trendingTopics]

    return [...new Set(allQueries)] // Remove duplicates
  }

  /**
   * Execute parallel searches across different sources and strategies
   */
  private async executeParallelSearches(queries: string[]): Promise<any[]> {
    const searchPromises = queries.map(query => 
      this.searchWithTavily(query)
    )

    const results = await Promise.allSettled(searchPromises)
    
    // Flatten and filter successful results
    return results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
      .flat()
  }

  /**
   * Search using Tavily API with intelligent query optimization
   */
  private async searchWithTavily(query: string): Promise<any[]> {
    try {
      const response = await fetch('/api/agentic-workflow/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.user.token}`
        },
        body: JSON.stringify({
          query,
          searchDepth: this.config.searchDepth,
          includeImages: this.config.includeImages,
          maxResults: 5
        })
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.results || []

    } catch (error) {
      console.error('Tavily search failed for query:', query, error)
      return []
    }
  }

  /**
   * Analyze and rank content using AI-powered analysis
   */
  private async analyzeAndRankContent(results: any[]): Promise<EnhancedSearchResult[]> {
    const analysisPromises = results.map(result => 
      this.analyzeContent(result)
    )

    const analyzedResults = await Promise.allSettled(analysisPromises)
    
    return analyzedResults
      .filter((result): result is PromiseFulfilledResult<EnhancedSearchResult> => result.status === 'fulfilled')
      .map(result => result.value)
  }

  /**
   * Analyze individual content piece using AI
   */
  private async analyzeContent(result: any): Promise<EnhancedSearchResult> {
    try {
      const response = await fetch('/api/agentic-workflow/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.user.token}`
        },
        body: JSON.stringify({
          content: result.content,
          title: result.title,
          url: result.url,
          source: result.source
        })
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const analysis = await response.json()

      return {
        title: result.title,
        url: result.url,
        content: result.content,
        excerpt: result.excerpt || this.generateExcerpt(result.content),
        source: result.source,
        timestamp: result.timestamp || new Date().toISOString(),
        category: analysis.category || 'AI News',
        tags: analysis.tags || [],
        analysis: analysis.analysis,
        readTime: this.calculateReadTime(result.content),
        trending: analysis.trending || false,
        image: result.image
      }

    } catch (error) {
      console.error('Content analysis failed:', error)
      // Return basic result if analysis fails
      return {
        title: result.title,
        url: result.url,
        content: result.content,
        excerpt: this.generateExcerpt(result.content),
        source: result.source,
        timestamp: result.timestamp || new Date().toISOString(),
        category: 'AI News',
        tags: [],
        analysis: {
          relevance: 0.5,
          credibility: 0.5,
          recency: 0.5,
          engagement: 0.5,
          personalization: 0.5,
          overallScore: 0.5
        },
        readTime: this.calculateReadTime(result.content),
        trending: false,
        image: result.image
      }
    }
  }

  /**
   * Personalize results based on user preferences
   */
  private async personalizeResults(results: EnhancedSearchResult[]): Promise<EnhancedSearchResult[]> {
    return results.map(result => {
      // Calculate personalization score based on user preferences
      const personalizationScore = this.calculatePersonalizationScore(result)
      
      return {
        ...result,
        analysis: {
          ...result.analysis,
          personalization: personalizationScore,
          overallScore: this.calculateOverallScore({
            ...result.analysis,
            personalization: personalizationScore
          })
        }
      }
    })
  }

  /**
   * Calculate personalization score based on user preferences
   */
  private calculatePersonalizationScore(result: EnhancedSearchResult): number {
    return calculatePersonalizationScore(
      result.content,
      result.title,
      result.source,
      this.userPreferences
    )
  }

  /**
   * Generate intelligent summaries for content
   */
  private async generateSummaries(results: EnhancedSearchResult[]): Promise<EnhancedSearchResult[]> {
    const summaryPromises = results.map(result => 
      this.generateSummary(result)
    )

    const summarizedResults = await Promise.allSettled(summaryPromises)
    
    return summarizedResults
      .filter((result): result is PromiseFulfilledResult<EnhancedSearchResult> => result.status === 'fulfilled')
      .map(result => result.value)
  }

  /**
   * Generate summary for individual content
   */
  private async generateSummary(result: EnhancedSearchResult): Promise<EnhancedSearchResult> {
    try {
      const response = await fetch('/api/agentic-workflow/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.user.token}`
        },
        body: JSON.stringify({
          content: result.content,
          title: result.title,
          style: this.config.summarizationStyle,
          readingLevel: this.userPreferences.readingLevel
        })
      })

      if (!response.ok) {
        throw new Error(`Summarization failed: ${response.statusText}`)
      }

      const summary = await response.json()

      return {
        ...result,
        excerpt: summary.excerpt || result.excerpt,
        content: summary.summary || result.content
      }

    } catch (error) {
      console.error('Summarization failed:', error)
      return result
    }
  }

  /**
   * Final ranking and filtering of results
   */
  private finalRankingAndFiltering(results: EnhancedSearchResult[]): EnhancedSearchResult[] {
    // Sort by overall score (descending)
    const sortedResults = results.sort((a, b) => 
      b.analysis.overallScore - a.analysis.overallScore
    )

    // Filter out low-quality results
    const filteredResults = sortedResults.filter(result => 
      result.analysis.overallScore >= 0.3
    )

    // Limit to configured max results
    return filteredResults.slice(0, this.config.maxResults)
  }

  /**
   * Calculate overall score from analysis components
   */
  private calculateOverallScore(analysis: ContentAnalysis): number {
    const weights = {
      relevance: 0.25,
      credibility: 0.20,
      recency: 0.20,
      engagement: 0.15,
      personalization: 0.20
    }

    return (
      analysis.relevance * weights.relevance +
      analysis.credibility * weights.credibility +
      analysis.recency * weights.recency +
      analysis.engagement * weights.engagement +
      analysis.personalization * weights.personalization
    )
  }

  /**
   * Generate excerpt from content
   */
  private generateExcerpt(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content
    
    const excerpt = content.substring(0, maxLength)
    const lastSpace = excerpt.lastIndexOf(' ')
    
    return lastSpace > 0 ? excerpt.substring(0, lastSpace) + '...' : excerpt + '...'
  }

  /**
   * Calculate estimated reading time
   */
  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    
    return `${minutes} min read`
  }
}

/**
 * Factory function to create and execute workflow
 */
export async function executeAgenticWorkflow(user: User, config?: WorkflowConfig): Promise<EnhancedSearchResult[]> {
  const workflow = new AgenticWorkflow(user, config)
  return await workflow.executeWorkflow()
}
