# Deployment Guide for ShortLink Pro

This guide provides step-by-step instructions for deploying your URL shortener to various hosting platforms.

## 🚀 Quick Deploy Options

### Option 1: Vercel + Railway (Recommended)

**Frontend (Vercel):**
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Set the root directory to `apps/web`
4. Deploy automatically

**Backend (Railway):**
1. Connect your GitHub repo to Railway
2. Set the root directory to `apps/api`
3. Railway will auto-detect and deploy

### Option 2: Netlify + Render

**Frontend (Netlify):**
1. Connect your GitHub repo
2. Set build directory: `apps/web`
3. Build command: `npm run build`
4. Publish directory: `apps/web/dist`

**Backend (Render):**
1. Connect your GitHub repo
2. Use the included `render.yaml` configuration
3. Deploy as a Web Service

### Option 3: Docker Deployment

**Build and run with Docker:**
```bash
# Backend
cd apps/api
docker build -t url-shortener-api .
docker run -p 5000:5000 url-shortener-api

# Frontend (build and serve with nginx)
cd apps/web
npm run build
# Serve the dist folder with your preferred web server
```

## 🔧 Environment Configuration

### Backend Environment Variables
Create a `.env` file in `apps/api/`:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=./production.db
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Environment Variables
Create a `.env` file in `apps/web/`:
```env
VITE_API_URL=https://your-api-domain.com
```

## 📋 Pre-Deployment Checklist

- [ ] Update API URL in frontend to point to your deployed backend
- [ ] Set up CORS properly in the backend
- [ ] Configure environment variables
- [ ] Test the application locally
- [ ] Ensure database is properly configured
- [ ] Set up SSL certificates (handled by most platforms)

## 🔄 Continuous Deployment

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd apps/web && npm ci && npm run build
      # Add your deployment steps here

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd apps/api && npm ci && npm run build
      # Add your deployment steps here
```

## 🌐 Platform-Specific Instructions

### Vercel (Frontend)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the `apps/web` directory
3. Follow the prompts

### Railway (Backend)
1. Install Railway CLI: `npm i -g @railway/cli`
2. Run `railway login` and `railway init`
3. Deploy with `railway up`

### Render (Backend)
1. Connect your GitHub repository
2. Select "Web Service"
3. Use the included `render.yaml` configuration

### Heroku (Backend)
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Set buildpack: `heroku buildpacks:set heroku/nodejs`
4. Deploy: `git push heroku main`

## 🔍 Post-Deployment Testing

1. Test the health endpoint: `GET /health`
2. Create a test short URL
3. Verify redirection works
4. Check analytics functionality
5. Test QR code generation

## 🛠 Troubleshooting

### Common Issues:
- **CORS errors**: Update CORS configuration in backend
- **Database issues**: Ensure SQLite file permissions are correct
- **Build failures**: Check Node.js version compatibility
- **API connection**: Verify API URL in frontend environment variables

### Debugging:
- Check application logs in your hosting platform
- Use browser dev tools to inspect network requests
- Test API endpoints directly with tools like Postman

## 📊 Monitoring

Consider setting up:
- Error tracking (Sentry, LogRocket)
- Performance monitoring
- Uptime monitoring
- Analytics (Google Analytics, Plausible)

## 🔄 Updates

To update your deployment:
1. Push changes to your main branch
2. Most platforms will auto-deploy
3. For manual deployments, repeat the deployment steps

---

Need help? Check the main README.md or open an issue on GitHub!
