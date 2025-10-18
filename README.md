# UnpackAI - AI News Hub

A beautiful Progressive Web App (PWA) for AI news aggregation with a Spotify-inspired design. Built with Next.js, TypeScript, and Tailwind CSS, this app provides a mobile-first experience for staying updated with the latest AI developments.

## 🚀 Features

### ✨ Design & UI
- **Spotify-inspired Interface**: Beautiful dark theme with green accent colors
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Progressive Web App**: Installable on mobile devices with offline capabilities
- **Smooth Animations**: Hover effects and transitions for enhanced user experience
- **Custom Scrollbars**: Styled scrollbars matching the Spotify aesthetic

### 📱 Mobile Experience
- **PWA Support**: Install as a native app on iOS and Android
- **Touch-Friendly**: Large touch targets and smooth scrolling
- **Offline Capability**: Service worker for offline functionality
- **App-like Navigation**: Bottom navigation bar for mobile users

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
# N8n Integration (when implemented)
N8N_WEBHOOK_URL=your_n8n_webhook_url
N8N_API_KEY=your_n8n_api_key

# News API (when implemented)
NEWS_API_KEY=your_news_api_key
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
- **N8n Integration**: Connect with N8n workflows for automated news aggregation
- **Real-time Updates**: WebSocket connections for live news updates
- **User Preferences**: Customizable categories and sources
- **Search Functionality**: Search through news articles
- **Bookmarking**: Save articles for later reading
- **Push Notifications**: Get notified of breaking AI news
- **Offline Reading**: Cache articles for offline access

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