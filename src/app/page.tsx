"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { LayoutControls, type LayoutSettings } from "@/components/layout-controls"
import { NewsViews, type NewsArticle } from "@/components/news-views"
import { 
  RefreshCw, 
  TrendingUp, 
  Clock, 
  Star, 
  Play,
  Pause,
  Volume2
} from "lucide-react"

// Mock data for AI news articles
const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: "OpenAI Releases GPT-5 with Enhanced Reasoning Capabilities",
    excerpt: "The latest iteration brings significant improvements in logical reasoning and mathematical problem-solving.",
    content: "OpenAI has announced the release of GPT-5, featuring groundbreaking improvements in logical reasoning, mathematical problem-solving, and creative writing. The new model demonstrates human-level performance across multiple benchmarks and shows particular strength in complex problem-solving tasks that require multi-step reasoning...",
    source: "TechCrunch",
    url: "https://techcrunch.com/gpt-5-release",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
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
    content: "Google's latest Gemini Pro 2.0 model has achieved remarkable improvements in coding tasks, showing a 40% increase in performance compared to its predecessor. The model excels in code generation, debugging, and understanding complex programming concepts across multiple languages...",
    source: "The Verge",
    url: "https://theverge.com/gemini-pro-2-performance",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
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
    content: "Microsoft has significantly expanded its Copilot AI assistant integration, now supporting over 500 enterprise applications. This expansion brings AI-powered assistance to virtually every aspect of business operations, from document creation to data analysis...",
    source: "ZDNet",
    url: "https://zdnet.com/microsoft-copilot-enterprise",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
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
    content: "Anthropic's Claude 3.5 Sonnet has achieved human-level performance in creative writing tasks, according to new evaluation metrics. The model demonstrates exceptional capabilities in storytelling, poetry, and creative content generation that rivals professional human writers...",
    source: "AI News",
    url: "https://ainews.com/claude-3-5-creative-writing",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
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
    content: "Tesla's Full Self-Driving Beta 12.3 has shown a remarkable 95% reduction in disengagement events compared to previous versions. This significant improvement brings autonomous driving closer to widespread deployment with enhanced safety and reliability...",
    source: "Electrek",
    url: "https://electrek.co/tesla-fsd-beta-12-3",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    category: "Autonomous Vehicles",
    readTime: "8 min read",
    trending: true,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
    tags: ["Tesla", "FSD", "Autonomous Driving", "AI Safety"]
  }
]

const categories = [
  { name: "All", active: true },
  { name: "AI Research", active: false },
  { name: "AI Development", active: false },
  { name: "Enterprise AI", active: false },
  { name: "Autonomous Vehicles", active: false }
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isPlaying, setIsPlaying] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  
  // Layout settings state
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    viewType: 'grid',
    cardSize: 'medium',
    cardPreview: 'excerpt',
    wrapProperties: true,
    groupBy: 'none',
    colorColumns: false,
    showIcons: true
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const filteredNews = selectedCategory === "All" 
    ? mockNews 
    : mockNews.filter(article => article.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 notion-glass border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 notion-gradient rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <h1 className="text-xl font-bold notion-text-gradient">UnpackAI</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-sidebar border-r border-border min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Discover
                </h3>
                <Button variant="ghost" className="w-full justify-start text-foreground bg-primary/10">
                  <TrendingUp className="w-4 h-4 mr-3" />
                  Trending Now
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                  <Clock className="w-4 h-4 mr-3" />
                  Latest News
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                  <Star className="w-4 h-4 mr-3" />
                  Bookmarked
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Categories
                </h3>
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant="ghost"
                    className={`w-full justify-start ${
                      selectedCategory === category.name 
                        ? 'text-foreground bg-primary/10' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Mobile Category Filter */}
          <div className="md:hidden mb-6">
            <ScrollArea className="w-full">
              <div className="flex space-x-2 pb-2">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    size="sm"
                    className={`whitespace-nowrap ${
                      selectedCategory === category.name 
                        ? 'spotify-gradient border-0' 
                        : ''
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <div className="notion-gradient rounded-2xl p-6 md:p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Good morning! 🌅
              </h2>
              <p className="text-white/80 text-sm md:text-base">
                Here&apos;s what&apos;s happening in AI today. Stay ahead of the curve with the latest developments.
              </p>
            </div>
          </div>

          {/* Layout Controls */}
          <LayoutControls
            settings={layoutSettings}
            onSettingsChange={setLayoutSettings}
            articleCount={filteredNews.length}
          />

          {/* News Feed */}
          <div className="space-y-6">
            <NewsViews
              articles={filteredNews}
              viewType={layoutSettings.viewType}
              cardSize={layoutSettings.cardSize}
              cardPreview={layoutSettings.cardPreview}
              wrapProperties={layoutSettings.wrapProperties}
              groupBy={layoutSettings.groupBy}
              colorColumns={layoutSettings.colorColumns}
              showIcons={layoutSettings.showIcons}
            />
          </div>
        </main>
      </div>

      {/* Bottom Player Bar (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 notion-glass border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md" />
            <div>
              <p className="text-sm font-medium">AI News Brief</p>
              <p className="text-xs text-muted-foreground">Stay updated</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-foreground"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}