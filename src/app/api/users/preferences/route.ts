import { NextRequest, NextResponse } from 'next/server'

// Mock user preferences - replace with real database
const mockPreferences = {
  '1': {
    userId: '1',
    preferredCategories: ['AI Research', 'AI Development', 'Enterprise AI'],
    followedEntities: ['OpenAI', 'Google', 'Microsoft', 'Anthropic', 'Tesla'],
    trustedSources: ['TechCrunch', 'The Verge', 'ZDNet', 'AI News'],
    customSources: [
      'https://blog.openai.com/rss.xml',
      'https://www.anthropic.com/news/rss'
    ],
    notificationSettings: {
      email: true,
      push: true,
      frequency: 'daily',
      breakingNews: true
    },
    minRelevanceScore: 6,
    customCategories: {
      'AI Research': 'Research & Development',
      'AI Development': 'Product Updates',
      'Enterprise AI': 'Business Applications'
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // In a real app, get user ID from JWT token
    const userId = request.headers.get('x-user-id') || '1'
    
    const preferences = mockPreferences[userId as keyof typeof mockPreferences]
    
    if (!preferences) {
      return NextResponse.json(
        { error: 'User preferences not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      userPreferences: [preferences]
    })

  } catch (error) {
    console.error('Get preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || '1'
    const updates = await request.json()

    // In a real app, update the database
    if (mockPreferences[userId as keyof typeof mockPreferences]) {
      mockPreferences[userId as keyof typeof mockPreferences] = {
        ...mockPreferences[userId as keyof typeof mockPreferences],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully'
    })

  } catch (error) {
    console.error('Update preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

