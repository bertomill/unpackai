#!/bin/bash

# Manual N8n Setup Script (without Docker)
echo "🔧 Manual N8n Setup Guide"
echo "========================="
echo ""

echo "📋 Prerequisites:"
echo "1. Docker Desktop must be running"
echo "2. API keys for Tavily and OpenAI"
echo "3. Environment variables configured"
echo ""

echo "🚀 Step 1: Start Docker Services"
echo "Run this command in your terminal:"
echo "  docker compose up -d"
echo ""

echo "⏳ Wait for services to start (30 seconds)..."
echo ""

echo "🌐 Step 2: Access N8n Interface"
echo "Open: http://localhost:5678"
echo "Login: admin / unpackai2024"
echo ""

echo "📥 Step 3: Import Workflow"
echo "1. Click 'Import from File'"
echo "2. Select: n8n-simple-workflow.json"
echo "3. Click 'Import'"
echo ""

echo "🔑 Step 4: Configure Credentials"
echo "A. Tavily API:"
echo "   - Go to Credentials → Create New"
echo "   - Name: 'Tavily API'"
echo "   - API Key: Your Tavily key"
echo ""
echo "B. OpenAI API:"
echo "   - Go to Credentials → Create New"
echo "   - Name: 'OpenAI API'"
echo "   - API Key: Your OpenAI key"
echo ""

echo "🔗 Step 5: Configure Webhook"
echo "1. Click on 'Webhook Trigger' node"
echo "2. Copy the webhook URL"
echo "3. Update your .env.local:"
echo "   N8N_WEBHOOK_URL=<webhook-url>"
echo ""

echo "🧪 Step 6: Test the Workflow"
echo "1. Click 'Execute Workflow' in N8n"
echo "2. Check each node for errors"
echo "3. Verify all credentials work"
echo ""

echo "✅ Step 7: Test Full System"
echo "1. Start your Next.js app: npm run dev"
echo "2. Test API: curl -X POST http://localhost:3000/api/refresh-async"
echo "3. Check queue stats: curl http://localhost:3000/api/queue-stats"
echo ""

echo "🎉 Setup Complete!"
echo "Your N8n workflow is ready to handle agentic processing."
echo ""
echo "📚 For detailed instructions, see: N8N_WORKFLOW_SETUP.md"
