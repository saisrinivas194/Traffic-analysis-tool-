# JADTrax — Your Complete Traffic & Regional Analytics Platform

> **JADTrax by JAD Tech — Track, Analyze, Optimize Your Global Web Traffic**

## 🚀 What is JADTrax?

**JADTrax** is a comprehensive, self-hosted web analytics platform that provides real-time traffic monitoring, user behavior insights, regional analytics, and advanced tracking capabilities for any website or web application.

### The JADTrax Brand Story

**JADTrax = JAD Tech + Tracks/Tracking**

✅ **JAD** → Represents your company JAD Tech, ensuring brand consistency.

✅ **Trax** → A modern, tech-style spelling of Tracks, implying:
- Tracking website traffic
- Monitoring user behavior  
- Following regional performance trends
- Real-time data tracking
- Insightful movement and flow tracking across platforms

**Why "Trax" Works Well:**
- Feels modern, tech-forward, and product-friendly
- Short, catchy, easy to remember
- Suggests actionable, real-time monitoring
- The "x" adds a startup/innovative feel (similar to brands like SpaceX, Dropbox)

## 🌟 Key Features

### 📊 **Real-Time Analytics**
- Live visitor monitoring
- Active sessions tracking
- Pageviews per minute
- Real-time dashboard updates

### 🌍 **Regional Analytics**
- Country-wise traffic analysis
- City-level insights
- Geographic performance tracking
- Regional device breakdown
- Multi-country support (15+ major countries)

### 🔥 **Advanced Tracking**
- Pageview tracking
- Custom event tracking
- Heatmap data collection
- Session recording
- Conversion funnel analysis

### 📈 **Comprehensive Insights**
- SEO performance metrics
- Traffic source analysis
- User behavior patterns
- Device and browser analytics
- Bounce rate optimization

### 🔒 **Privacy-First**
- Self-hosted solution
- No third-party tracking
- GDPR compliant
- Complete data ownership

## 🛠️ Technology Stack

- **Backend**: Python 3.12+ with SQLite
- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Real-time**: Auto-refresh with polling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.12+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd jadtrax
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Start the backend server**
```bash
cd server
python analyzer.py
```

4. **Start the frontend (in a new terminal)**
```bash
npm run dev
```

5. **Access JADTrax**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8001

## 📡 API Endpoints

### Tracking Endpoints
- `POST /track/pageview` - Track pageviews
- `POST /track/event` - Track custom events
- `POST /track/heatmap` - Track heatmap data

### Analytics Endpoints
- `GET /analytics/summary` - Get analytics summary
- `GET /analytics/realtime` - Get real-time data
- `GET /analytics/regions` - Get region-wise analytics
- `GET /analytics/heatmap` - Get heatmap data
- `GET /analytics/funnel` - Get conversion funnel

### SEO & Analysis
- `POST /seo/analyze` - Analyze SEO metrics
- `GET /analytics/available-regions` - Get available regions

## 🌍 Regional Analytics

JADTrax supports comprehensive regional analytics for 15+ major countries:

- 🇺🇸 United States
- 🇨🇳 China  
- 🇮🇳 India
- 🇬🇧 United Kingdom
- 🇩🇪 Germany
- 🇫🇷 France
- 🇯🇵 Japan
- 🇧🇷 Brazil
- 🇨🇦 Canada
- 🇦🇺 Australia
- 🇷🇺 Russia
- ��🇷 South Korea
- 🇮🇹 Italy
- 🇪🇸 Spain
- 🇲🇽 Mexico

Each country includes major cities and detailed analytics.

## 📊 Dashboard Features

### Overview Tab
- Total pageviews and unique visitors
- Bounce rate and session duration
- Traffic sources breakdown
- Top performing pages
- Device analytics

### Real-Time Tab
- Active sessions (last 5 minutes)
- Hourly pageviews
- Pageviews per minute
- Live timestamp updates

### Regional Analytics Tab
- Country and city selection
- Regional performance metrics
- Geographic traffic distribution
- Regional device breakdown
- Top countries and cities

### SEO Analytics Tab
- Core Web Vitals
- Page load times
- Keyword rankings
- SEO score analysis

### User Behavior Tab
- Heatmap visualization
- Session recordings
- Conversion funnels
- Event tracking

## 🔧 Configuration

### Environment Variables
```bash
# Backend Configuration
API_PORT=8001
DATABASE_PATH=traffic_analytics.db

# Frontend Configuration  
VITE_API_BASE_URL=http://localhost:8001
```

### Custom Tracking Script
Add this to any website you want to track:

```html
<script>
fetch('http://localhost:8001/track/pageview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: window.location.href,
    user_agent: navigator.userAgent,
    referrer: document.referrer,
    time_on_page: 0,
    bounce: false
  })
});
</script>
```

## 📈 Usage Examples

### Track a Pageview
```bash
curl -X POST http://localhost:8001/track/pageview \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "user_agent": "Mozilla/5.0...",
    "ip_address": "192.168.1.1",
    "referrer": "https://google.com"
  }'
```

### Get Real-Time Data
```bash
curl http://localhost:8001/analytics/realtime
```

### Get Regional Analytics
```bash
curl "http://localhost:8001/analytics/regions?time_range=24h&country_code=US"
```

## 🏗️ Architecture

```
JADTrax/
├── server/                 # Python backend
│   ├── analyzer.py        # Main server
│   └── traffic_analytics.db # SQLite database
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── hooks/            # Custom hooks
│   └── App.tsx           # Main app
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## 🔒 Privacy & Security

- **Self-hosted**: Your data stays on your servers
- **No external dependencies**: Complete control over data
- **GDPR compliant**: Built with privacy in mind
- **Encrypted storage**: SQLite with proper data handling

## 🚀 Deployment

### Production Setup
1. Deploy backend to your server
2. Update frontend API URL
3. Configure SSL certificates
4. Set up monitoring and backups

### Docker Deployment (Coming Soon)
```bash
docker-compose up -d
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: [Link to docs]
- **Issues**: [GitHub Issues]
- **Email**: support@jadtech.com

---

**JADTrax** — Empowering businesses with comprehensive, real-time web analytics and regional insights.

*Built with ❤️ by JAD Tech*
