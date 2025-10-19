#!/usr/bin/env node

/**
 * Test Redis Cloud Connection
 * Run this script to verify your Redis Cloud setup
 */

const Redis = require('ioredis')
require('dotenv').config({ path: '.env.local' })

async function testRedisCloud() {
  console.log('🧪 Testing Redis Cloud Connection...\n')

  const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null
  }

  // Add password only if provided
  if (process.env.REDIS_PASSWORD) {
    redisConfig.password = process.env.REDIS_PASSWORD
  }

  console.log('📋 Connection Config:')
  console.log(`   Host: ${redisConfig.host}`)
  console.log(`   Port: ${redisConfig.port}`)
  console.log(`   Password: ${redisConfig.password ? '***' : 'None'}\n`)

  const redis = new Redis(redisConfig)

  try {
    // Test basic connection
    console.log('🔌 Testing connection...')
    const pong = await redis.ping()
    console.log(`✅ Ping response: ${pong}\n`)

    // Test basic operations
    console.log('📝 Testing basic operations...')
    await redis.set('test:key', 'Hello Redis Cloud!')
    const value = await redis.get('test:key')
    console.log(`✅ Set/Get test: ${value}\n`)

    // Test queue operations (like your app uses)
    console.log('📊 Testing queue operations...')
    await redis.lpush('test:queue', 'job1', 'job2', 'job3')
    const queueLength = await redis.llen('test:queue')
    console.log(`✅ Queue length: ${queueLength}`)
    
    const job = await redis.rpop('test:queue')
    console.log(`✅ Popped job: ${job}`)

    // Cleanup
    await redis.del('test:key')
    await redis.del('test:queue')
    console.log('🧹 Cleaned up test data\n')

    console.log('🎉 Redis Cloud connection test PASSED!')
    console.log('🚀 Your Redis Cloud setup is working correctly.')

  } catch (error) {
    console.error('❌ Redis Cloud connection test FAILED!')
    console.error('Error:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check your Redis Cloud connection details')
    console.log('2. Ensure your IP is whitelisted (if required)')
    console.log('3. Verify your password is correct')
    console.log('4. Check if your Redis Cloud database is active')
  } finally {
    redis.disconnect()
  }
}

// Run the test
testRedisCloud().catch(console.error)
