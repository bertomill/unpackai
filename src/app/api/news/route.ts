import { NextRequest, NextResponse } from 'next/server'

// Mock data - in a real app, this would come from your N8n workflow or database
const mockNewsData = [
  {
    id: 1,
    title: "OpenAI Releases GPT-5 with Enhanced Reasoning Capabilities",
    excerpt: "The latest iteration brings significant improvements in logical reasoning and mathematical problem-solving.",
    content: "OpenAI has announced the release of GPT-5, featuring groundbreaking improvements in logical reasoning, mathematical problem-solving, and creative writing. The new model demonstrates human-level performance across multiple benchmarks...",
    source: "TechCrunch",
    url: "https://techcrunch.com/gpt-5-release",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    category: "AI Research",
    readTime: "4 min read",
    trending: true,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    tags: ["OpenAI", "GPT-5", "AI Research", "Machine Learning"]
  },
  {
    id: 2,
    title: "Google's Gemini Pro 2.0 Shows 40% Better Performance in Coding Tasks",
    excerpt: "New benchmarks reveal substantial improvements in code generation and debugging capabilities.",
    content: "Google's latest Gemini Pro 2.0 model has achieved remarkable improvements in coding tasks, showing a 40% increase in performance compared to its predecessor. The model excels in code generation, debugging, and understanding complex programming concepts...",
    source: "The Verge",
    url: "https://theverge.com/gemini-pro-2-performance",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    category: "AI Development",
    readTime: "6 min read",
    trending: true,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    tags: ["Google", "Gemini", "Coding", "AI Development"]
  },
  {
    id: 3,
    title: "Microsoft Copilot Integration Expands to 500+ Enterprise Apps",
    excerpt: "The AI assistant now works seamlessly across Microsoft's entire enterprise ecosystem.",
    content: "Microsoft has significantly expanded its Copilot AI assistant integration, now supporting over 500 enterprise applications. This expansion brings AI-powered assistance to virtually every aspect of business operations...",
    source: "ZDNet",
    url: "https://zdnet.com/microsoft-copilot-enterprise",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    category: "Enterprise AI",
    readTime: "5 min read",
    trending: false,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
    tags: ["Microsoft", "Copilot", "Enterprise", "AI Integration"]
  },
  {
    id: 4,
    title: "Anthropic's Claude 3.5 Sonnet Achieves Human-Level Performance in Creative Writing",
    excerpt: "New evaluation metrics show the model's creative capabilities rival human writers.",
    content: "Anthropic's Claude 3.5 Sonnet has achieved human-level performance in creative writing tasks, according to new evaluation metrics. The model demonstrates exceptional capabilities in storytelling, poetry, and creative content generation...",
    source: "AI News",
    url: "https://ainews.com/claude-3-5-creative-writing",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    category: "AI Research",
    readTime: "7 min read",
    trending: false,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    tags: ["Anthropic", "Claude", "Creative Writing", "AI Research"]
  },
  {
    id: 5,
    title: "Tesla's FSD Beta 12.3 Shows 95% Reduction in Disengagement Events",
    excerpt: "Latest autonomous driving update demonstrates significant safety improvements.",
    content: "Tesla's Full Self-Driving Beta 12.3 has shown a remarkable 95% reduction in disengagement events compared to previous versions. This significant improvement brings autonomous driving closer to widespread deployment...",
    source: "Electrek",
    url: "https://electrek.co/tesla-fsd-beta-12-3",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    category: "Autonomous Vehicles",
    readTime: "8 min read",
    trending: true,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
    tags: ["Tesla", "FSD", "Autonomous Driving", "AI Safety"]
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const trending = searchParams.get('trending') === 'true'

    let filteredNews = mockNewsData

    // Filter by category
    if (category && category !== 'All') {
      filteredNews = filteredNews.filter(article => article.category === category)
    }

    // Filter by trending
    if (trending) {
      filteredNews = filteredNews.filter(article => article.trending)
    }

    // Limit results
    filteredNews = filteredNews.slice(0, limit)

    // Format response for frontend
    const formattedNews = filteredNews.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      source: article.source,
      timestamp: article.timestamp,
      category: article.category,
      readTime: article.readTime,
      trending: article.trending,
      image: article.image,
      url: article.url,
      tags: article.tags
    }))

    return NextResponse.json({
      success: true,
      data: formattedNews,
      meta: {
        total: filteredNews.length,
        category: category || 'All',
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch news data',
        message: 'Please try again later'
      },
      { status: 500 }
    )
  }
}

// Webhook endpoint for N8n integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate webhook payload
    if (!body || !body.articles) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload' },
        { status: 400 }
      )
    }

    // Process articles from N8n workflow
    const { articles, source, timestamp } = body

    console.log(`Received ${articles.length} articles from N8n workflow:`, {
      source,
      timestamp,
      articleCount: articles.length
    })

    // Here you would typically:
    // 1. Validate the article data
    // 2. Store in database
    // 3. Update cache
    // 4. Send notifications if needed

    // For now, just log and acknowledge
    return NextResponse.json({
      success: true,
      message: `Successfully processed ${articles.length} articles`,
      receivedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process webhook',
        message: 'Invalid JSON payload'
      },
      { status: 400 }
    )
  }
}
