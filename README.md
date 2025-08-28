# ShortLink Pro - URL Shortener

A modern, feature-rich URL shortener with analytics, QR code generation, and AI-powered suggestions.

## Features

- 🔗 **URL Shortening**: Create short, memorable links
- 📊 **Analytics**: Track clicks, devices, referrers, and geographic data
- 🎨 **QR Codes**: Generate and download QR codes for your links
- 🤖 **AI Integration**: Get AI-powered descriptions and alias suggestions
- 🌙 **Dark Mode**: Beautiful dark/light theme toggle
- 📱 **Responsive**: Works perfectly on all devices
- ⚡ **Fast**: Built with React and Vite for optimal performance

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, TypeScript, SQLite
- **AI**: Google Gemini API for smart suggestions

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd url-shortener
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Environment Setup

For AI features, add your Google Gemini API key to the workspace settings in the app.

## Deployment

### Option 1: Vercel (Recommended)

1. **Deploy Frontend:**
   ```bash
   cd apps/web
   npm run build
   # Deploy dist folder to Vercel
   ```

2. **Deploy Backend:**
   ```bash
   cd apps/api
   npm run build
   # Deploy to Railway, Render, or similar
   ```

### Option 2: Railway

1. Connect your GitHub repo to Railway
2. Set the root directory to `apps/api`
3. Add environment variables if needed
4. Deploy

### Option 3: Render

1. Create a new Web Service
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Deploy

## API Endpoints

- `POST /api/urls` - Create a new short URL
- `GET /api/urls/:shortCode` - Redirect to original URL
- `GET /api/urls/:shortCode/stats` - Get URL analytics
- `GET /health` - Health check

## Project Structure

```
url-shortener/
├── apps/
│   ├── api/                 # Backend API
│   │   ├── src/
│   │   │   ├── config/      # Database config
│   │   │   ├── routes/      # API routes
│   │   │   └── index.ts     # Main server file
│   │   └── package.json
│   └── web/                 # Frontend React app
│       ├── src/
│       │   ├── App.jsx      # Main component
│       │   ├── main.jsx     # Entry point
│       │   └── index.css    # Styles
│       └── package.json
├── package.json             # Root package.json
└── README.md
```

## Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development
- `npm run dev:api` - Start only the backend
- `npm run dev:web` - Start only the frontend
- `npm run build` - Build both apps for production
- `npm start` - Start production backend

### Database

The app uses SQLite for simplicity. The database file (`urls.db`) will be created automatically on first run.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes!

## Support

If you encounter any issues or have questions, please open an issue on GitHub.