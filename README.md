# UnpackAI - AI News Hub

A beautiful Progressive Web App (PWA) for AI news aggregation with a Spotify-inspired design. Built with Next.js, TypeScript, and Tailwind CSS, this app provides a mobile-first experience for staying updated with the latest AI developments.

## 🚀 Features

### 🤖 Agentic Workflow Engine
- **Intelligent Search**: Conducts targeted searches across key AI websites using Tavily API
- **AI-Powered Analysis**: Uses OpenAI to analyze content relevance, credibility, and engagement
- **Smart Summarization**: Generates personalized summaries based on user reading level
- **Content Personalization**: Ranks and filters content based on user preferences and interests
- **Real-time Aggregation**: Fetches fresh, personalized AI news with each refresh
- **Multi-source Intelligence**: Searches across research papers, news sites, and community sources

### ✨ Design & UI
- **Spotify-inspired Interface**: Beautiful dark theme with green accent colors
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Progressive Web App**: Installable on mobile devices with offline capabilities
- **Smooth Animations**: Hover effects and transitions for enhanced user experience
- **Custom Scrollbars**: Styled scrollbars matching the Spotify aesthetic

### 📱 Mobile Experience
- **PWA Support**: Install as a native app on iOS and Android
- **Touch-Friendly**: Large touch targets (44px minimum) and smooth scrolling
- **Offline Capability**: Service worker for offline functionality with cached content
- **App-like Navigation**: Bottom navigation bar for mobile users
- **Responsive Layout**: Optimized layouts for all screen sizes (mobile, tablet, desktop)
- **Mobile-First Design**: Designed with mobile users in mind
- **Adaptive UI Elements**: Buttons, cards, and text scale appropriately
- **Touch Gestures**: Swipe-friendly category filters and smooth interactions
- **Install Prompts**: Smart installation prompts for different platforms
- **Offline Page**: Custom offline experience when no internet connection

### 🎨 UI Components
- **Card-based Layout**: Clean, organized news articles with images
- **Category Filtering**: Filter news by AI Research, Development, Enterprise, etc.
- **Trending Indicators**: Highlight trending articles with badges
- **Interactive Elements**: Bookmark, share, and more options for each article

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **shadcn/ui**: High-quality, accessible UI components
- **Next.js 15**: Latest React framework with App Router
- **Responsive Design**: Works seamlessly across all device sizes

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **PWA**: next-pwa for Progressive Web App functionality

## 📱 PWA Features

### Progressive Web App Capabilities
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Service worker caches content for offline viewing
- **App-like Experience**: Standalone mode without browser UI
- **Background Sync**: Sync data when connection is restored
- **Push Notifications**: Get notified about new AI news (configurable)
- **Responsive Icons**: Multiple icon sizes for different platforms
- **Smart Install Prompts**: Platform-specific installation instructions

### Installation Instructions
1. **Desktop (Chrome/Edge)**: Look for the install button in the address bar
2. **Mobile (Android)**: Tap "Add to Home Screen" when prompted
3. **iOS Safari**: Tap Share → "Add to Home Screen"
4. **Manual Installation**: Use the install prompts in the app

### Offline Features
- **Cached Content**: Previously viewed articles available offline
- **Offline Page**: Custom offline experience with retry options
- **Background Sync**: Automatically sync when connection returns
- **Local Storage**: User preferences and settings preserved

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unpackai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Latest Updates (December 2024)
- ✅ **Build Issues Fixed**: Resolved all TypeScript/ESLint compilation errors
- ✅ **Type Safety Improved**: Fixed async constructor issues and type assertions
- ✅ **Redis Integration**: Enhanced queue service with proper error handling
- ✅ **User Authentication**: Fixed User interface compatibility issues
- ✅ **Code Quality**: Removed unused variables and improved type definitions

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📱 PWA Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will be installed as a native app

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen" or "Install App"
4. The app will be installed as a native app

## 🎨 Design System

### Color Palette
- **Primary Green**: #1db954 (Spotify Green)
- **Background**: #121212 (Spotify Black)
- **Card Background**: #181818 (Dark Gray)
- **Border**: #282828 (Light Gray)
- **Text**: #ffffff (White)
- **Muted Text**: #b3b3b3 (Gray)

### Typography
- **Font Family**: Geist Sans (Primary), Geist Mono (Code)
- **Responsive Sizing**: Scales appropriately across devices

### Components
- **Cards**: Rounded corners with hover effects
- **Buttons**: Multiple variants (primary, ghost, outline)
- **Badges**: For categories and trending indicators
- **Scroll Areas**: Custom styled scrollbars

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Agentic Workflow APIs
TAVILY_API_KEY=your_tavily_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# N8n Integration (when implemented)
N8N_WEBHOOK_URL=your_n8n_webhook_url
N8N_API_KEY=your_n8n_api_key

# News API (when implemented)
NEWS_API_KEY=your_news_api_key

# Database Configuration
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here
```

### PWA Configuration
The PWA is configured in `next.config.js` with:
- Service worker for offline functionality
- Caching strategies for different asset types
- Manifest file for app installation

## 📂 Project Structure

```
unpackai/
├── public/
│   ├── icons/                 # PWA icons
│   ├── screenshots/           # PWA screenshots
│   └── manifest.json         # PWA manifest
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles with Spotify theme
│   │   ├── layout.tsx        # Root layout with PWA meta tags
│   │   └── page.tsx          # Main page with news feed
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   └── theme-provider.tsx # Theme context provider
│   └── lib/
│       └── utils.ts          # Utility functions
├── next.config.js            # Next.js and PWA configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

## 🔮 Future Enhancements

### Planned Features
- **Enhanced Personalization**: Advanced user preference learning and adaptation
- **Real-time Updates**: WebSocket connections for live news updates
- **Advanced Search**: Semantic search through aggregated content
- **Bookmarking**: Save articles for later reading
- **Push Notifications**: Get notified of breaking AI news
- **Offline Reading**: Cache articles for offline access
- **Content Recommendations**: AI-powered article recommendations
- **User Analytics**: Track reading patterns and engagement metrics

### Agentic Workflow Architecture
The app features a sophisticated agentic workflow system:

#### 🔍 Search Strategy
- **Multi-source Intelligence**: Searches across research papers (ArXiv), news sites (TechCrunch, The Verge), and community sources (Reddit, Hacker News)
- **Intelligent Query Generation**: Creates personalized search queries based on user preferences and current AI trends
- **Parallel Processing**: Executes multiple searches simultaneously for comprehensive coverage

#### 🧠 AI Analysis Pipeline
- **Content Analysis**: Uses OpenAI to evaluate relevance, credibility, recency, and engagement
- **Smart Categorization**: Automatically categorizes content (AI Research, Industry News, Product Updates)
- **Trending Detection**: Identifies viral and trending content
- **Quality Scoring**: Ranks content based on multiple factors

#### 👤 Personalization Engine
- **User Preference Learning**: Adapts to user interests, reading level, and preferred sources
- **Content Filtering**: Excludes topics user doesn't want to see
- **Reading Level Adaptation**: Adjusts content complexity based on user expertise
- **Source Prioritization**: Favors user's preferred news sources

#### 📄 Smart Summarization
- **Adaptive Summaries**: Generates summaries based on user's reading level (beginner, intermediate, advanced)
- **Key Point Extraction**: Identifies and highlights the most important information
- **Reading Time Calculation**: Provides accurate time estimates for content consumption

### N8n Workflow Integration
The app is designed to work seamlessly with N8n workflows:
- **News Aggregation**: Automated collection from multiple AI news sources
- **Content Processing**: AI-powered summarization and categorization
- **Personalization**: User preference-based content filtering
- **Analytics**: Track reading patterns and engagement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spotify**: Design inspiration and color palette
- **shadcn/ui**: Beautiful UI components
- **Next.js Team**: Amazing React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide**: Beautiful icon library

## 📞 Support

If you have any questions or need help with the project, please:
1. Check the [Issues](https://github.com/your-username/unpackai/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Built with ❤️ for the AI community**