#!/bin/bash

# N8n Workflow Test Script
echo "🧪 Testing N8n Workflow"
echo "======================="
echo ""

# Configuration
N8N_URL="http://localhost:5678"
WEBHOOK_URL=""
AUTH_TOKEN="your_test_token_here"  # Replace with actual token

echo "🔍 Step 1: Check N8n Status"
if curl -s "$N8N_URL" > /dev/null 2>&1; then
    echo "✅ N8n is running at $N8N_URL"
else
    echo "❌ N8n is not running. Please start Docker services first."
    echo "   Run: docker compose up -d"
    exit 1
fi

echo ""
echo "🔍 Step 2: Check Redis Status"
if docker exec unpackai-redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running"
else
    echo "❌ Redis is not running"
    exit 1
fi

echo ""
echo "🔍 Step 3: Test Webhook Endpoint"
echo "Please provide your N8n webhook URL:"
read -p "Webhook URL: " WEBHOOK_URL

if [ -z "$WEBHOOK_URL" ]; then
    echo "❌ Webhook URL is required"
    exit 1
fi

echo "Testing webhook: $WEBHOOK_URL"

# Test webhook with sample data
response=$(curl -s -w "%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{
        "jobId": "test-123",
        "userId": "user-123",
        "config": {
            "maxResults": 3,
            "searchDepth": "basic"
        }
    }' \
    "$WEBHOOK_URL" 2>/dev/null)

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    echo "✅ Webhook test successful"
    echo "Response: $response_body"
else
    echo "❌ Webhook test failed (HTTP $http_code)"
    echo "Response: $response_body"
fi

echo ""
echo "🔍 Step 4: Test Next.js API"
if curl -s "http://localhost:3000/api/queue-stats" > /dev/null 2>&1; then
    echo "✅ Next.js API is running"
else
    echo "❌ Next.js API is not running. Please start with: npm run dev"
fi

echo ""
echo "🔍 Step 5: Test Full Flow"
echo "Testing complete workflow..."

# Test the async API
api_response=$(curl -s -w "%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d '{
        "config": {
            "maxResults": 3,
            "searchDepth": "basic"
        }
    }' \
    "http://localhost:3000/api/refresh-async" 2>/dev/null)

api_http_code="${api_response: -3}"
api_response_body="${api_response%???}"

if [ "$api_http_code" = "200" ]; then
    echo "✅ API test successful"
    echo "Response: $api_response_body"
    
    # Extract job ID for monitoring
    job_id=$(echo "$api_response_body" | grep -o '"jobId":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$job_id" ]; then
        echo "📊 Monitoring job: $job_id"
        echo "Check status with: curl -H 'Authorization: Bearer $AUTH_TOKEN' 'http://localhost:3000/api/refresh-async?jobId=$job_id'"
    fi
else
    echo "❌ API test failed (HTTP $api_http_code)"
    echo "Response: $api_response_body"
fi

echo ""
echo "🎉 Test Complete!"
echo ""
echo "📊 Next Steps:"
echo "1. Check N8n interface: http://localhost:5678"
echo "2. Monitor workflow execution"
echo "3. Check queue stats: curl http://localhost:3000/api/queue-stats"
echo "4. Test with more concurrent requests"
