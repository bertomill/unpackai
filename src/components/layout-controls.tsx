"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Grid3X3, 
  List, 
  Calendar, 
  BarChart3, 
  LayoutGrid,
  Settings,
  ChevronDown,
  Eye,
  Maximize2,
  WrapText
} from "lucide-react"

export interface LayoutSettings {
  viewType: 'grid' | 'list' | 'timeline' | 'calendar' | 'gallery' | 'chart'
  cardSize: 'small' | 'medium' | 'large'
  cardPreview: 'none' | 'excerpt' | 'full'
  wrapProperties: boolean
  groupBy: 'none' | 'category' | 'trending' | 'source' | 'date'
  colorColumns: boolean
  showIcons: boolean
}

interface LayoutControlsProps {
  settings: LayoutSettings
  onSettingsChange: (settings: LayoutSettings) => void
  articleCount: number
}

const viewTypes = [
  { id: 'grid', label: 'Grid', icon: Grid3X3, description: 'Card-based layout', shortLabel: 'Grid' },
  { id: 'list', label: 'List', icon: List, description: 'Compact list view', shortLabel: 'List' },
  { id: 'timeline', label: 'Timeline', icon: Calendar, description: 'Chronological view', shortLabel: 'Time' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, description: 'Date-based view', shortLabel: 'Cal' },
  { id: 'gallery', label: 'Gallery', icon: LayoutGrid, description: 'Image-focused view', shortLabel: 'Gallery' },
  { id: 'chart', label: 'Chart', icon: BarChart3, description: 'Analytics view', shortLabel: 'Chart' }
]

const cardSizes = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' }
]

const cardPreviews = [
  { id: 'none', label: 'None' },
  { id: 'excerpt', label: 'Excerpt' },
  { id: 'full', label: 'Full' }
]

const groupByOptions = [
  { id: 'none', label: 'None' },
  { id: 'category', label: 'Category' },
  { id: 'trending', label: 'Trending' },
  { id: 'source', label: 'Source' },
  { id: 'date', label: 'Date' }
]

export function LayoutControls({ settings, onSettingsChange, articleCount }: LayoutControlsProps) {
  const [showSettings, setShowSettings] = useState(false)

  const handleSettingChange = (key: keyof LayoutSettings, value: string | boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header with View Type Selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <h3 className="text-base sm:text-lg font-semibold">Layout</h3>
          <Badge variant="secondary" className="notion-gradient text-white border-0 text-xs">
            {articleCount} articles
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="text-muted-foreground hover:text-foreground hidden sm:flex"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="text-muted-foreground hover:text-foreground sm:hidden h-8 w-8 p-0"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* View Type Selection */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 sm:gap-2">
        {viewTypes.map((view) => {
          const Icon = view.icon
          const isSelected = settings.viewType === view.id
          
          return (
            <Button
              key={view.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`h-auto p-2 sm:p-3 flex flex-col items-center space-y-1 sm:space-y-2 ${
                isSelected ? 'notion-gradient border-0 text-white' : ''
              }`}
              onClick={() => handleSettingChange('viewType', view.id)}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs font-medium hidden sm:block">{view.label}</span>
              <span className="text-xs font-medium sm:hidden">{view.shortLabel}</span>
            </Button>
          )
        })}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Layout Settings</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(false)}
            >
              Done
            </Button>
          </div>

          <Separator />

          {/* Card Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Card preview</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {cardPreviews.find(p => p.id === settings.cardPreview)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Card Size */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Maximize2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Card size</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {cardSizes.find(s => s.id === settings.cardSize)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Wrap Properties */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <WrapText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Wrap all properties</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`w-12 h-6 rounded-full p-0 ${
                settings.wrapProperties 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
              onClick={() => handleSettingChange('wrapProperties', !settings.wrapProperties)}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.wrapProperties ? 'translate-x-3' : 'translate-x-0'
              }`} />
            </Button>
          </div>

          {/* Group By */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Group by</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {groupByOptions.find(g => g.id === settings.groupBy)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Color Columns */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Color columns</span>
            <Button
              variant="ghost"
              size="sm"
              className={`w-12 h-6 rounded-full p-0 ${
                settings.colorColumns 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
              onClick={() => handleSettingChange('colorColumns', !settings.colorColumns)}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.colorColumns ? 'translate-x-3' : 'translate-x-0'
              }`} />
            </Button>
          </div>

          {/* Show Page Icons */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Show page icons</span>
            <Button
              variant="ghost"
              size="sm"
              className={`w-12 h-6 rounded-full p-0 ${
                settings.showIcons 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
              onClick={() => handleSettingChange('showIcons', !settings.showIcons)}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.showIcons ? 'translate-x-3' : 'translate-x-0'
              }`} />
            </Button>
          </div>

          <Separator />

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>?</span>
            <span>Learn about views</span>
          </div>
        </div>
      )}
    </div>
  )
}
