# 🚀 Redis Cloud Setup Guide

This guide will help you set up Redis Cloud for production deployment of your UnpackAI application.

## 🎯 Why Redis Cloud?

- ✅ **Free Tier**: 30MB storage, perfect for development and small production apps
- ✅ **Managed Service**: No need to maintain Redis infrastructure
- ✅ **Global Availability**: Deploy in multiple regions
- ✅ **Auto-scaling**: Scales with your application needs
- ✅ **High Availability**: Built-in redundancy and failover

## 📋 Step-by-Step Setup

### 1. Create Redis Cloud Account

1. **Visit**: [Redis Cloud Sign-Up](https://redis.io/docs/latest/operate/rc/rc-quickstart/)
2. **Sign up** using:
   - Google account (recommended)
   - GitHub account
   - Email and password
3. **Verify your email** if using email signup

### 2. Create Your First Database

1. **Click "Create database"**
2. **Select Free plan** (30 MB storage)
3. **Choose configuration**:
   - **Database name**: `unpackai-redis`
   - **Cloud provider**: AWS (recommended)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
4. **Click "Create database"**

### 3. Get Connection Details

Once your database is created:

1. **Go to "Configuration" tab**
2. **Copy the connection details**:
   - **Endpoint**: `your-db-name.c1.us-east1-2.gce.cloud.redislabs.com`
   - **Port**: `6379` (usually)
   - **Password**: Click the eye icon to reveal

### 4. Configure Your Application

#### For Local Development (.env.local)
```env
# Redis Cloud Configuration
REDIS_HOST=your-db-name.c1.us-east1-2.gce.cloud.redislabs.com
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_cloud_password_here
```

#### For Vercel Deployment
Add these environment variables in your Vercel dashboard:
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`

## 🔧 Testing Your Redis Cloud Connection

### Option 1: Using Redis CLI
```bash
# Install redis-cli if not already installed
brew install redis

# Connect to your Redis Cloud database
redis-cli -h your-db-name.c1.us-east1-2.gce.cloud.redislabs.com -p 6379 -a your_password

# Test the connection
127.0.0.1:6379> ping
PONG
```

### Option 2: Test from Your App
```bash
# Start your development server
npm run dev

# The app will automatically connect to Redis Cloud if configured
```

## 🌐 Vercel Deployment Configuration

### 1. Add Environment Variables in Vercel

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add the following**:

```
REDIS_HOST = your-db-name.c1.us-east1-2.gce.cloud.redislabs.com
REDIS_PORT = 6379
REDIS_PASSWORD = your_redis_cloud_password_here
```

### 2. Redeploy Your Application

```bash
# Push your changes
git add .
git commit -m "Configure Redis Cloud for production"
git push origin main

# Vercel will automatically redeploy with the new environment variables
```

## 🔍 Monitoring Your Redis Cloud Database

### Redis Insight (Recommended)
1. **Download Redis Insight**: [redis.com/redis-enterprise/redis-insight](https://redis.com/redis-enterprise/redis-insight/)
2. **Connect to your database** using the connection details
3. **Monitor performance** and usage

### Redis Cloud Dashboard
- **View metrics**: Memory usage, operations per second
- **Monitor connections**: Active connections and commands
- **Set up alerts**: Get notified of issues

## 💰 Pricing Information

### Free Tier
- **30 MB storage**
- **30 connections**
- **Perfect for development and small production apps**

### Paid Plans
- **Start at $7/month**
- **More storage and connections**
- **Advanced features like clustering**

## 🔧 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if your IP is whitelisted
   - Verify connection details

2. **Authentication Failed**
   - Double-check your password
   - Ensure you're using the correct username (usually `default`)

3. **Memory Limit Reached**
   - Monitor your database usage
   - Consider upgrading to a paid plan

### Getting Help
- **Redis Cloud Support**: [support.redislabs.com](https://support.redislabs.com)
- **Redis Community**: [community.redis.com](https://community.redis.com)
- **Documentation**: [redis.io/docs](https://redis.io/docs)

## 🚀 Next Steps

Once Redis Cloud is set up:

1. **Test your application** with Redis Cloud
2. **Deploy to Vercel** with the new environment variables
3. **Monitor performance** using Redis Insight
4. **Set up alerts** for production monitoring

Your UnpackAI application will now have a robust, scalable Redis backend for handling concurrent users and job processing! 🎉
