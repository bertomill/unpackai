import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock user database - replace with real database
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Demo User',
    preferences: {
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
]

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email)
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

    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      name,
      password: hashedPassword,
      preferences: {
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

    // In a real app, you would save this to your database here
    // For now, we'll just add it to the mock array
    mockUsers.push(newUser)

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
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
