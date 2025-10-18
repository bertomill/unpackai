import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createUser, getUserByEmail, createUserPreferences } from '@/lib/user-db'
import { initializeDatabase } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Initialize database tables if they don't exist
    await initializeDatabase()

    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user in database
    const newUser = await createUser(email, hashedPassword, name)

    // Create default user preferences
    const preferences = await createUserPreferences(newUser.id, {
      preferred_categories: ['AI Research', 'AI Development'],
      followed_entities: ['OpenAI', 'Google', 'Microsoft'],
      trusted_sources: ['TechCrunch', 'The Verge'],
      custom_sources: [],
      notification_settings: {
        email: true,
        push: true,
        frequency: 'daily'
      },
      min_relevance_score: 6
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id.toString(), email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Return user data with preferences
    const userResponse = {
      id: newUser.id.toString(),
      email: newUser.email,
      name: newUser.name,
      preferences: {
        preferredCategories: preferences.preferred_categories,
        followedEntities: preferences.followed_entities,
        trustedSources: preferences.trusted_sources,
        customSources: preferences.custom_sources,
        notificationSettings: preferences.notification_settings,
        minRelevanceScore: preferences.min_relevance_score
      }
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      token
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
