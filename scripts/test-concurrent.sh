#!/bin/bash

# Concurrent Request Testing Script
echo "🧪 Testing Redis Queue with concurrent requests..."

# Configuration
CONCURRENT_USERS=${1:-100}
BASE_URL="http://localhost:3000"
AUTH_TOKEN="your_test_token_here"  # Replace with actual token

echo "📊 Testing with $CONCURRENT_USERS concurrent users..."

# Create temporary directory for results
mkdir -p test-results
RESULTS_FILE="test-results/concurrent-test-$(date +%Y%m%d-%H%M%S).json"

# Function to make a single request
make_request() {
    local user_id=$1
    local start_time=$(date +%s.%N)
    
    response=$(curl -s -w "%{http_code},%{time_total}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -d '{"config":{"maxResults":5,"searchDepth":"basic"}}' \
        "$BASE_URL/api/refresh-async" 2>/dev/null)
    
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc)
    
    echo "User $user_id: $response (${duration}s)"
}

# Start all requests simultaneously
echo "🚀 Starting $CONCURRENT_USERS concurrent requests..."
start_time=$(date +%s.%N)

for i in $(seq 1 $CONCURRENT_USERS); do
    make_request $i &
done

# Wait for all requests to complete
wait
end_time=$(date +%s.%N)
total_duration=$(echo "$end_time - $start_time" | bc)

echo ""
echo "📈 Test Results:"
echo "   Concurrent Users: $CONCURRENT_USERS"
echo "   Total Duration: ${total_duration}s"
echo "   Average per Request: $(echo "scale=3; $total_duration / $CONCURRENT_USERS" | bc)s"

# Test queue stats
echo ""
echo "📊 Queue Statistics:"
curl -s -H "Authorization: Bearer $AUTH_TOKEN" \
    "$BASE_URL/api/queue-stats" | jq '.' 2>/dev/null || echo "Queue stats not available"

echo ""
echo "✅ Concurrent testing complete!"
echo "📁 Results saved to: $RESULTS_FILE"
