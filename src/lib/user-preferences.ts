/**
 * User Preferences Management
 * Handles user preferences for personalization in the agentic workflow
 */

// import { User } from '@/lib/auth'

export interface UserPreferences {
  interests: string[]
  readingLevel: 'beginner' | 'intermediate' | 'advanced'
  preferredSources: string[]
  topics: string[]
  timePreference: 'morning' | 'afternoon' | 'evening'
  readingTime: number // minutes per session
  categories: string[]
  excludedTopics: string[]
  language: string
  region: string
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  interests: ['AI Research', 'Machine Learning', 'Tech News'],
  readingLevel: 'intermediate',
  preferredSources: ['TechCrunch', 'The Verge', 'OpenAI Blog', 'ArXiv'],
  topics: ['artificial intelligence', 'machine learning', 'neural networks', 'deep learning'],
  timePreference: 'morning',
  readingTime: 15,
  categories: ['AI Research', 'AI Development', 'Industry News'],
  excludedTopics: ['cryptocurrency', 'blockchain'],
  language: 'en',
  region: 'us'
}

/**
 * Get user preferences from database or create defaults
 */
export async function getUserPreferences(_userId: string): Promise<UserPreferences> {
  try {
    // This would typically fetch from database
    // For now, return intelligent defaults based on user profile
    return DEFAULT_USER_PREFERENCES
  } catch (error) {
    console.error('Failed to get user preferences:', error)
    return DEFAULT_USER_PREFERENCES
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string, 
  preferences: Partial<UserPreferences>
): Promise<boolean> {
  try {
    // This would typically update the database
    console.log('Updating user preferences:', userId, preferences)
    return true
  } catch (error) {
    console.error('Failed to update user preferences:', error)
    return false
  }
}

/**
 * Generate intelligent search queries based on user preferences
 */
export function generatePersonalizedQueries(preferences: UserPreferences): string[] {
  const queries: string[] = []
  
  // Interest-based queries
  preferences.interests.forEach(interest => {
    queries.push(`${interest} latest news 2024`)
    queries.push(`${interest} recent developments`)
  })
  
  // Topic-based queries
  preferences.topics.forEach(topic => {
    queries.push(`${topic} breakthrough`)
    queries.push(`${topic} innovation`)
    queries.push(`${topic} research`)
  })
  
  // Source-specific queries
  preferences.preferredSources.forEach(source => {
    queries.push(`site:${source.toLowerCase().replace(/\s+/g, '')} AI news`)
  })
  
  // Time-based queries
  const timeBasedQueries = [
    'AI news today',
    'artificial intelligence this week',
    'machine learning recent developments',
    'AI breakthroughs 2024'
  ]
  queries.push(...timeBasedQueries)
  
  return [...new Set(queries)] // Remove duplicates
}

/**
 * Calculate personalization score for content
 */
export function calculatePersonalizationScore(
  content: string,
  title: string,
  source: string,
  preferences: UserPreferences
): number {
  let score = 0.5 // Base score
  
  // Check source preference
  if (preferences.preferredSources.some(prefSource => 
    source.toLowerCase().includes(prefSource.toLowerCase())
  )) {
    score += 0.2
  }
  
  // Check interest alignment
  const text = (content + ' ' + title).toLowerCase()
  const interestMatches = preferences.interests.filter(interest => 
    text.includes(interest.toLowerCase())
  ).length
  
  if (interestMatches > 0) {
    score += (interestMatches / preferences.interests.length) * 0.2
  }
  
  // Check topic alignment
  const topicMatches = preferences.topics.filter(topic => 
    text.includes(topic.toLowerCase())
  ).length
  
  if (topicMatches > 0) {
    score += (topicMatches / preferences.topics.length) * 0.2
  }
  
  // Check category alignment
  const categoryMatches = preferences.categories.filter(category => 
    text.includes(category.toLowerCase())
  ).length
  
  if (categoryMatches > 0) {
    score += (categoryMatches / preferences.categories.length) * 0.1
  }
  
  // Penalize excluded topics
  const excludedMatches = preferences.excludedTopics.filter(topic => 
    text.includes(topic.toLowerCase())
  ).length
  
  if (excludedMatches > 0) {
    score -= (excludedMatches / preferences.excludedTopics.length) * 0.3
  }
  
  return Math.max(0, Math.min(score, 1.0))
}

/**
 * Get recommended sources based on user preferences
 */
export function getRecommendedSources(preferences: UserPreferences): string[] {
  const allSources = [
    'TechCrunch', 'The Verge', 'Wired', 'Ars Technica', 'VentureBeat',
    'ZDNet', 'OpenAI Blog', 'Google AI Blog', 'Microsoft AI Blog',
    'NVIDIA Blog', 'Anthropic Blog', 'Hugging Face Blog', 'ArXiv',
    'Reddit r/MachineLearning', 'Hacker News', 'Twitter AI'
  ]
  
  // Filter based on user preferences
  return allSources.filter(source => {
    const sourceLower = source.toLowerCase()
    
    // Include if it matches user's preferred sources
    if (preferences.preferredSources.some(pref => 
      sourceLower.includes(pref.toLowerCase())
    )) {
      return true
    }
    
    // Include if it matches user's interests
    if (preferences.interests.some(interest => 
      sourceLower.includes(interest.toLowerCase())
    )) {
      return true
    }
    
    return false
  })
}

/**
 * Get content categories based on user preferences
 */
export function getContentCategories(preferences: UserPreferences): string[] {
  const allCategories = [
    'AI Research', 'AI Development', 'Industry News', 'Product Updates',
    'Enterprise AI', 'Autonomous Vehicles', 'Computer Vision',
    'Natural Language Processing', 'Robotics', 'AI Ethics'
  ]
  
  // Return user's preferred categories or all if none specified
  return preferences.categories.length > 0 ? preferences.categories : allCategories
}
