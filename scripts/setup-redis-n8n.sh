#!/bin/bash

# UnpackAI Redis + N8n Setup Script
echo "🚀 Setting up Redis + N8n for UnpackAI..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from env.example..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your API keys!"
fi

# Start Redis and N8n
echo "🐳 Starting Redis and N8n containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if Redis is running
if docker exec unpackai-redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running on localhost:6379"
else
    echo "❌ Redis failed to start"
    exit 1
fi

# Check if N8n is running
if curl -s http://localhost:5678 > /dev/null 2>&1; then
    echo "✅ N8n is running on http://localhost:5678"
    echo "🔑 Login credentials:"
    echo "   Username: admin"
    echo "   Password: unpackai2024"
else
    echo "❌ N8n failed to start"
    exit 1
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Open http://localhost:5678 in your browser"
echo "2. Login with admin/unpackai2024"
echo "3. Import the workflow from n8n-agentic-workflow.json"
echo "4. Configure your API keys in N8n"
echo "5. Test with: npm run dev"
echo ""
echo "📊 Monitor queue stats: GET /api/queue-stats"
echo "🔄 Test concurrent requests: ./scripts/test-concurrent.sh"
