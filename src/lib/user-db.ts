import { db } from './db'

export interface User {
  id: number
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface UserWithPassword extends User {
  password: string
}

export interface UserPreferences {
  id?: number
  user_id: number
  preferred_categories: string[]
  followed_entities: string[]
  trusted_sources: string[]
  custom_sources: string[]
  notification_settings: {
    email: boolean
    push: boolean
    frequency: string
    breakingNews?: boolean
  }
  min_relevance_score: number
  created_at?: string
  updated_at?: string
}

// User operations
export async function createUser(email: string, hashedPassword: string, name: string): Promise<User> {
  const query = `
    INSERT INTO users (email, password, name)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, created_at, updated_at
  `
  const values = [email, hashedPassword, name]
  
  const result = await db.query(query, values)
  return result.rows[0]
}

export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  const query = `
    SELECT id, email, password, name, created_at, updated_at
    FROM users
    WHERE email = $1
  `
  const result = await db.query(query, [email])
  return result.rows[0] || null
}

export async function getUserById(id: number): Promise<User | null> {
  const query = `
    SELECT id, email, name, created_at, updated_at
    FROM users
    WHERE id = $1
  `
  const result = await db.query(query, [id])
  return result.rows[0] || null
}

export async function updateUser(id: number, updates: Partial<User>): Promise<User | null> {
  const setClause = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ')
  
  const query = `
    UPDATE users
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, email, name, created_at, updated_at
  `
  const values = [id, ...Object.values(updates)]
  
  const result = await db.query(query, values)
  return result.rows[0] || null
}

// User preferences operations
export async function createUserPreferences(userId: number, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
  const query = `
    INSERT INTO user_preferences (
      user_id,
      preferred_categories,
      followed_entities,
      trusted_sources,
      custom_sources,
      notification_settings,
      min_relevance_score
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `
  
  const values = [
    userId,
    JSON.stringify(preferences.preferred_categories || ['AI Research', 'AI Development']),
    JSON.stringify(preferences.followed_entities || ['OpenAI', 'Google', 'Microsoft']),
    JSON.stringify(preferences.trusted_sources || ['TechCrunch', 'The Verge']),
    JSON.stringify(preferences.custom_sources || []),
    JSON.stringify(preferences.notification_settings || {
      email: true,
      push: true,
      frequency: 'daily'
    }),
    preferences.min_relevance_score || 6
  ]
  
  const result = await db.query(query, values)
  const row = result.rows[0]
  
  return {
    ...row,
    preferred_categories: row.preferred_categories,
    followed_entities: row.followed_entities,
    trusted_sources: row.trusted_sources,
    custom_sources: row.custom_sources,
    notification_settings: row.notification_settings
  }
}

export async function getUserPreferences(userId: number): Promise<UserPreferences | null> {
  const query = `
    SELECT *
    FROM user_preferences
    WHERE user_id = $1
  `
  const result = await db.query(query, [userId])
  
  if (result.rows.length === 0) {
    return null
  }
  
  const row = result.rows[0]
  return {
    ...row,
    preferred_categories: row.preferred_categories,
    followed_entities: row.followed_entities,
    trusted_sources: row.trusted_sources,
    custom_sources: row.custom_sources,
    notification_settings: row.notification_settings
  }
}

export async function updateUserPreferences(userId: number, updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
  const setClause = Object.keys(updates)
    .filter(key => key !== 'user_id' && key !== 'id')
    .map((key, index) => {
      if (['preferred_categories', 'followed_entities', 'trusted_sources', 'custom_sources', 'notification_settings'].includes(key)) {
        return `${key} = $${index + 2}::jsonb`
      }
      return `${key} = $${index + 2}`
    })
    .join(', ')
  
  const query = `
    UPDATE user_preferences
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $1
    RETURNING *
  `
  
  const values = [userId, ...Object.values(updates).map(value => 
    typeof value === 'object' ? JSON.stringify(value) : value
  )]
  
  const result = await db.query(query, values)
  
  if (result.rows.length === 0) {
    return null
  }
  
  const row = result.rows[0]
  return {
    ...row,
    preferred_categories: row.preferred_categories,
    followed_entities: row.followed_entities,
    trusted_sources: row.trusted_sources,
    custom_sources: row.custom_sources,
    notification_settings: row.notification_settings
  }
}
