import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getUserByEmail, getUserPreferences } from '@/lib/user-db'
import { initializeDatabase } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Initialize database tables if they don't exist
    await initializeDatabase()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user in database
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Get user preferences
    const preferences = await getUserPreferences(user.id)

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id.toString(), email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Return user data (without password) with preferences
    const userResponse = {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      preferences: preferences ? {
        preferredCategories: preferences.preferred_categories,
        followedEntities: preferences.followed_entities,
        trustedSources: preferences.trusted_sources,
        customSources: preferences.custom_sources,
        notificationSettings: preferences.notification_settings,
        minRelevanceScore: preferences.min_relevance_score
      } : {
        preferredCategories: ['AI Research', 'AI Development'],
        followedEntities: ['OpenAI', 'Google', 'Microsoft'],
        trustedSources: ['TechCrunch', 'The Verge'],
        customSources: [],
        notificationSettings: {
          email: true,
          push: true,
          frequency: 'daily'
        },
        minRelevanceScore: 6
      }
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

