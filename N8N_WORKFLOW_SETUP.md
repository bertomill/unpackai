# 🔧 N8n Workflow Setup Guide

This guide will help you set up the N8n workflow for the agentic system.

## 🚀 Prerequisites

1. **Docker Desktop** - Make sure Docker is running
2. **API Keys** - Tavily and OpenAI API keys
3. **Environment** - `.env.local` configured

## 📋 Step-by-Step Setup

### **Step 1: Start Docker Services**

```bash
# Make sure Docker Desktop is running, then:
docker compose up -d

# Check if services are running
docker ps
```

You should see:
- `unpackai-redis` (Redis)
- `unpackai-n8n` (N8n)

### **Step 2: Access N8n Interface**

1. Open browser: http://localhost:5678
2. Login credentials:
   - **Username**: `admin`
   - **Password**: `unpackai2024`

### **Step 3: Import the Workflow**

1. In N8n, click **"Import from File"**
2. Select `n8n-agentic-workflow.json`
3. Click **"Import"**

### **Step 4: Configure the Workflow**

#### **A. Webhook Configuration**
1. Click on the **"Webhook Trigger"** node
2. Set the webhook URL to: `http://localhost:5678/webhook/agentic-workflow`
3. Save the workflow

#### **B. Tavily API Configuration**
1. Click on **"Tavily Search"** node
2. Go to **"Credentials"** tab
3. Create new credential:
   - **Name**: `Tavily API`
   - **API Key**: Your Tavily API key
4. Save and test the connection

#### **C. OpenAI API Configuration**
1. Click on **"OpenAI Analysis"** node
2. Go to **"Credentials"** tab
3. Create new credential:
   - **Name**: `OpenAI API`
   - **API Key**: Your OpenAI API key
4. Save and test the connection

#### **D. OpenAI Summarize Configuration**
1. Click on **"OpenAI Summarize"** node
2. Use the same OpenAI credential from step C
3. Save the configuration

### **Step 5: Test the Workflow**

#### **Manual Test**
1. In N8n, click **"Execute Workflow"**
2. You should see the workflow run through all steps
3. Check each node for errors

#### **API Test**
```bash
# Test the webhook endpoint
curl -X POST http://localhost:5678/webhook/agentic-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "test-123",
    "userId": "user-123",
    "config": {
      "maxResults": 5,
      "searchDepth": "basic"
    }
  }'
```

### **Step 6: Configure Callback URL**

1. Click on **"Callback Response"** node
2. Set the URL to: `http://localhost:3000/api/refresh-callback`
3. Add headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN`

## 🔧 Workflow Configuration Details

### **Webhook Trigger**
- **Method**: POST
- **Path**: `/webhook/agentic-workflow`
- **Response**: JSON

### **Tavily Search Node**
```json
{
  "query": "={{ $json.config.searchQuery || 'AI news latest' }}",
  "search_depth": "={{ $json.config.searchDepth || 'advanced' }}",
  "include_images": "={{ $json.config.includeImages || true }}",
  "max_results": "={{ $json.config.maxResults || 10 }}"
}
```

### **OpenAI Analysis Node**
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert AI content analyst..."
    },
    {
      "role": "user", 
      "content": "Analyze this content: {{ $json.results[0].content }}"
    }
  ],
  "temperature": 0.3,
  "max_tokens": 1000
}
```

### **OpenAI Summarize Node**
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert content summarizer..."
    },
    {
      "role": "user",
      "content": "Summarize this content for {{ $json.config.readingLevel || 'intermediate' }} level: {{ $json.results[0].content }}"
    }
  ],
  "temperature": 0.4,
  "max_tokens": 1500
}
```

### **Callback Response Node**
```json
{
  "jobId": "={{ $json.jobId }}",
  "status": "completed",
  "results": "={{ $json.results }}",
  "analysis": "={{ $json.analysis }}",
  "summaries": "={{ $json.summaries }}",
  "timestamp": "={{ new Date().toISOString() }}"
}
```

## 🧪 Testing the Complete System

### **Step 1: Start Your Next.js App**
```bash
npm run dev
```

### **Step 2: Test the Full Flow**
```bash
# Test with a single request
curl -X POST http://localhost:3000/api/refresh-async \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "config": {
      "maxResults": 5,
      "searchDepth": "basic"
    }
  }'
```

### **Step 3: Monitor the Queue**
```bash
# Check queue statistics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/queue-stats
```

### **Step 4: Test Concurrent Requests**
```bash
# Test with 10 concurrent users
./scripts/test-concurrent.sh 10
```

## 🔍 Troubleshooting

### **Common Issues**

#### **1. N8n Not Starting**
```bash
# Check Docker logs
docker logs unpackai-n8n

# Restart N8n
docker compose restart n8n
```

#### **2. Workflow Not Triggering**
- Check webhook URL in N8n
- Verify the webhook is active
- Check N8n logs for errors

#### **3. API Credentials Not Working**
- Verify API keys are correct
- Check credential names in N8n
- Test credentials individually

#### **4. Callback Not Working**
- Verify callback URL is correct
- Check if Next.js app is running
- Verify authentication token

### **Debug Commands**

```bash
# Check Redis queue
docker exec unpackai-redis redis-cli LLEN job_queue

# Check N8n logs
docker logs unpackai-n8n -f

# Check Redis logs
docker logs unpackai-redis -f

# Test Redis connection
docker exec unpackai-redis redis-cli ping
```

## 📊 Expected Results

After successful setup:

✅ **N8n Interface**: Accessible at http://localhost:5678  
✅ **Webhook Active**: Responds to POST requests  
✅ **API Credentials**: Tavily and OpenAI working  
✅ **Workflow Execution**: All nodes execute successfully  
✅ **Callback Working**: Results sent back to Next.js  
✅ **Queue Processing**: Jobs processed in parallel  

## 🎯 Next Steps

1. **Test the workflow** with a single request
2. **Verify all credentials** are working
3. **Test concurrent requests** (10, 50, 100 users)
4. **Monitor performance** and adjust as needed
5. **Deploy to production** when ready

---

**Your N8n workflow is now ready to handle the agentic processing! 🚀**
