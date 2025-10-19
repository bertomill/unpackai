"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Bookmark,
  Share2,
  MoreHorizontal,
  User,
  Clock
} from "lucide-react"

export interface NewsArticle {
  id: number
  title: string
  excerpt: string
  content?: string
  source: string
  url?: string
  timestamp: string
  category: string
  readTime: string
  trending: boolean
  image: string
  tags?: string[]
}

interface NewsViewsProps {
  articles: NewsArticle[]
  viewType: 'grid' | 'list' | 'timeline' | 'calendar' | 'gallery' | 'chart'
  cardSize: 'small' | 'medium' | 'large'
  cardPreview: 'none' | 'excerpt' | 'full'
  wrapProperties?: boolean
  groupBy: 'none' | 'category' | 'trending' | 'source' | 'date'
  colorColumns?: boolean
  showIcons: boolean
}

export function NewsViews({
  articles,
  viewType,
  cardSize,
  cardPreview,
  wrapProperties: _wrapProperties = false,
  groupBy,
  colorColumns: _colorColumns = false,
  showIcons
}: NewsViewsProps) {
  
  // Group articles based on groupBy setting
  const groupedArticles = () => {
    if (groupBy === 'none') return { 'All': articles }
    
    const groups: { [key: string]: NewsArticle[] } = {}
    articles.forEach(article => {
      let groupKey = ''
      switch (groupBy) {
        case 'category':
          groupKey = article.category
          break
        case 'trending':
          groupKey = article.trending ? 'Trending' : 'Regular'
          break
        case 'source':
          groupKey = article.source
          break
        case 'date':
          groupKey = new Date(article.timestamp).toLocaleDateString()
          break
        default:
          groupKey = 'All'
      }
      
      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(article)
    })
    
    return groups
  }

  const renderGridView = (articles: NewsArticle[]) => (
    <div className={`grid gap-3 sm:gap-4 ${
      cardSize === 'small' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
      cardSize === 'medium' ? 'grid-cols-1 sm:grid-cols-2' :
      'grid-cols-1'
    }`}>
      {articles.map((article) => (
        <Card key={article.id} className="notion-card group">
          <CardContent className="p-0">
            <div className="flex flex-col">
              {/* Article Image */}
              <div className={`relative flex-shrink-0 ${
                cardSize === 'small' ? 'h-24 sm:h-32' :
                cardSize === 'medium' ? 'h-36 sm:h-48' : 'h-48 sm:h-64'
              }`}>
                {showIcons && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    </div>
                  </div>
                )}
                <Image
                  src={article.image}
                  alt={article.title}
                  width={400}
                  height={300}
                  className="object-cover rounded-t-lg sm:rounded-t-xl w-full h-full"
                />
                {article.trending && (
                  <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 notion-gradient border-0 text-xs">
                    <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    <span className="hidden sm:inline">Trending</span>
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Article Content */}
              <div className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {article.timestamp}
                  </span>
                </div>
                
                <CardTitle className={`mb-2 group-hover:text-primary transition-colors line-clamp-2 ${
                  cardSize === 'small' ? 'text-sm' :
                  cardSize === 'medium' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                }`}>
                  {article.title}
                </CardTitle>
                
                {cardPreview !== 'none' && (
                  <CardDescription className={`mb-3 line-clamp-2 sm:line-clamp-3 ${
                    cardSize === 'small' ? 'text-xs' : 'text-xs sm:text-sm'
                  }`}>
                    {cardPreview === 'excerpt' ? article.excerpt : article.content}
                  </CardDescription>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-muted-foreground min-w-0 flex-1">
                    <span className="font-medium truncate">{article.source}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{article.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                      <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0 hidden sm:flex">
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                      <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListView = (articles: NewsArticle[]) => (
    <div className="space-y-2 sm:space-y-3">
      {articles.map((article) => (
        <Card key={article.id} className="notion-card group">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start space-x-3 sm:space-x-4">
              {/* Article Image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={300}
                  height={200}
                  className="object-cover rounded-md sm:rounded-lg w-full h-full"
                />
                {article.trending && (
                  <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 notion-gradient border-0 text-xs">
                    <TrendingUp className="w-2 h-2 mr-1" />
                  </Badge>
                )}
              </div>

              {/* Article Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {article.timestamp}
                  </span>
                </div>
                
                <CardTitle className="text-sm sm:text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </CardTitle>
                
                {cardPreview !== 'none' && (
                  <CardDescription className="text-xs mb-2 line-clamp-2">
                    {cardPreview === 'excerpt' ? article.excerpt : article.content}
                  </CardDescription>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-muted-foreground min-w-0 flex-1">
                    <span className="font-medium truncate">{article.source}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{article.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Bookmark className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hidden sm:flex">
                      <Share2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderTimelineView = (articles: NewsArticle[]) => (
    <div className="relative">
      <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-border"></div>
      <div className="space-y-4 sm:space-y-6">
        {articles.map((article) => (
          <div key={article.id} className="relative flex items-start space-x-3 sm:space-x-4">
            {/* Timeline dot */}
            <div className="relative z-10 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
            </div>

            {/* Article content */}
            <Card className="notion-card group flex-1">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {article.timestamp}
                  </span>
                  {article.trending && (
                    <Badge className="notion-gradient border-0 text-xs">
                      <TrendingUp className="w-2 h-2 mr-1" />
                      <span className="hidden sm:inline">Trending</span>
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-sm sm:text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </CardTitle>
                
                {cardPreview !== 'none' && (
                  <CardDescription className="text-xs sm:text-sm mb-3 line-clamp-2">
                    {cardPreview === 'excerpt' ? article.excerpt : article.content}
                  </CardDescription>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-muted-foreground min-w-0 flex-1">
                    <span className="font-medium truncate">{article.source}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{article.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                      <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0 hidden sm:flex">
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                      <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )

  const renderGalleryView = (articles: NewsArticle[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
      {articles.map((article) => (
        <Card key={article.id} className="notion-card group overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <Image
                src={article.image}
                alt={article.title}
                width={400}
                height={300}
                className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {article.trending && (
                <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 notion-gradient border-0 text-xs">
                  <TrendingUp className="w-2 h-2 mr-1" />
                </Badge>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                <CardTitle className="text-xs sm:text-sm text-white mb-1 line-clamp-2">
                  {article.title}
                </CardTitle>
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span className="truncate">{article.source}</span>
                  <span className="hidden sm:inline">{article.readTime}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderChartView = (articles: NewsArticle[]) => (
    <div className="space-y-4 sm:space-y-6">
      {/* Category Distribution */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Articles by Category</h4>
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(
              articles.reduce((acc, article) => {
                acc[article.category] = (acc[article.category] || 0) + 1
                return acc
              }, {} as { [key: string]: number })
            ).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-xs sm:text-sm truncate flex-1 mr-2">{category}</span>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-16 sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full notion-gradient rounded-full transition-all duration-500"
                      style={{ width: `${(count / articles.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending vs Regular */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Trending vs Regular</h4>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">
                {articles.filter(a => a.trending).length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Trending</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">
                {articles.filter(a => !a.trending).length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Regular</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderView = (articles: NewsArticle[]) => {
    switch (viewType) {
      case 'grid':
        return renderGridView(articles)
      case 'list':
        return renderListView(articles)
      case 'timeline':
        return renderTimelineView(articles)
      case 'gallery':
        return renderGalleryView(articles)
      case 'chart':
        return renderChartView(articles)
      default:
        return renderGridView(articles)
    }
  }

  const grouped = groupedArticles()

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([groupName, groupArticles]) => (
        <div key={groupName}>
          {groupBy !== 'none' && (
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              {groupName}
              <Badge variant="secondary" className="ml-2">
                {groupArticles.length}
              </Badge>
            </h4>
          )}
          {renderView(groupArticles)}
        </div>
      ))}
    </div>
  )
}
