# 🤖 Agentic Workflow Setup Guide

This guide will help you set up the agentic workflow system for UnpackAI, which provides intelligent AI news aggregation and personalization.

## 🚀 Quick Start

### 1. Get API Keys

#### Tavily API (for intelligent web search)
1. Go to [Tavily.com](https://tavily.com)
2. Sign up for an account
3. Get your API key from the dashboard
4. Add to your `.env.local`:
   ```env
   TAVILY_API_KEY=your_tavily_api_key_here
   ```

#### OpenAI API (for content analysis and summarization)
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an account and add billing
3. Generate an API key
4. Add to your `.env.local`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Agentic Workflow APIs
TAVILY_API_KEY=your_tavily_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=UnpackAI
```

### 3. Test the Workflow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Sign up or log in to your account
4. Click the refresh button (🔄) in the header
5. Watch the agentic workflow in action!

## 🔧 How It Works

### The Agentic Workflow Process

1. **🔍 Intelligent Search**
   - Generates personalized search queries based on user preferences
   - Searches across multiple AI websites simultaneously
   - Uses Tavily API for intelligent web search

2. **🧠 AI Analysis**
   - Analyzes each piece of content for relevance, credibility, and engagement
   - Categorizes content automatically
   - Identifies trending topics

3. **👤 Personalization**
   - Ranks content based on user preferences
   - Filters out unwanted topics
   - Prioritizes preferred sources

4. **📄 Smart Summarization**
   - Generates summaries tailored to user's reading level
   - Extracts key points
   - Calculates reading time

### User Preferences System

The system learns from user behavior and preferences:

- **Interests**: AI Research, Machine Learning, Tech News, etc.
- **Reading Level**: Beginner, Intermediate, Advanced
- **Preferred Sources**: TechCrunch, The Verge, OpenAI Blog, etc.
- **Topics**: Specific AI topics of interest
- **Excluded Topics**: Topics to avoid

## 🎯 Customization

### Workflow Configuration

You can customize the workflow behavior by modifying the configuration in `/src/lib/agentic-workflow.ts`:

```typescript
const config = {
  maxResults: 15,           // Maximum number of articles to return
  searchDepth: 'medium',    // Search depth: 'basic', 'medium', 'advanced'
  personalizationLevel: 'advanced', // Personalization level
  summarizationStyle: 'detailed',   // Summary style
  includeImages: true,      // Include images in results
  includeVideos: false      // Include videos in results
}
```

### Search Sources

Modify the search sources in `/src/lib/agentic-workflow.ts`:

```typescript
export const AI_SOURCES = {
  research: [
    'arxiv.org',
    'openai.com',
    'anthropic.com',
    'deepmind.com',
    'huggingface.co'
  ],
  news: [
    'techcrunch.com',
    'theverge.com',
    'wired.com',
    'venturebeat.com',
    'zdnet.com'
  ],
  // ... more sources
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Tavily API key not configured"
- Make sure you've added `TAVILY_API_KEY` to your `.env.local` file
- Restart your development server after adding the key

#### 2. "OpenAI API key not configured"
- Make sure you've added `OPENAI_API_KEY` to your `.env.local` file
- Ensure you have credits in your OpenAI account

#### 3. "Refresh failed" error
- Check your internet connection
- Verify your API keys are correct
- Check the browser console for detailed error messages

#### 4. No results returned
- The workflow might be searching for very specific content
- Try adjusting the search queries in the configuration
- Check if your API keys have sufficient credits

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```env
DEBUG_AGENTIC_WORKFLOW=true
```

This will show detailed logs of the workflow execution in your console.

## 📊 Monitoring

### Workflow Performance

The system tracks several metrics:

- **Search Time**: How long searches take
- **Analysis Time**: How long AI analysis takes
- **Results Quality**: Relevance scores of returned content
- **User Engagement**: How users interact with personalized content

### API Usage

Monitor your API usage:

- **Tavily**: Check usage in your Tavily dashboard
- **OpenAI**: Monitor usage in your OpenAI dashboard

## 🔮 Advanced Configuration

### Custom Search Strategies

You can define custom search strategies for different content types:

```typescript
const SEARCH_STRATEGIES = {
  breaking: {
    keywords: ['breaking', 'announcement', 'release'],
    timeRange: '24h',
    priority: 'high'
  },
  research: {
    keywords: ['research', 'study', 'paper'],
    timeRange: '7d',
    priority: 'medium'
  }
}
```

### Personalization Weights

Adjust how different factors influence personalization:

```typescript
const weights = {
  relevance: 0.25,      // How relevant to AI/tech
  credibility: 0.20,    // Source trustworthiness
  recency: 0.20,      // How recent the content is
  engagement: 0.15,     // Likely to engage readers
  personalization: 0.20 // Matches user preferences
}
```

## 🆘 Support

If you encounter issues:

1. Check the [Issues](https://github.com/your-username/unpackai/issues) page
2. Create a new issue with:
   - Your environment setup
   - Error messages
   - Steps to reproduce
3. Include relevant logs and configuration

## 📚 Additional Resources

- [Tavily API Documentation](https://docs.tavily.com)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Happy AI News Aggregation! 🤖📰**
