# 🚀 TherapyAI Deployment Guide

## Quick Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)

1. **Push to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `web`
   - Add environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     NEXT_PUBLIC_WS_URL=wss://your-backend-url.railway.app
     ```

#### Backend (Railway)

1. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Set root directory to `server`
   - Add environment variables:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     GOOGLE_CLOUD_PROJECT_ID=your_project_id
     GOOGLE_SERVICE_ACCOUNT_KEY=your_service_account_json
     NODE_ENV=production
     ```

### Option 2: Docker Deployment

#### Local Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

#### Cloud Docker (DigitalOcean, AWS, etc.)

1. **Build Docker image**:

   ```bash
   docker build -t therapy-ai .
   ```

2. **Run container**:
   ```bash
   docker run -p 3000:3000 -p 3001:3001 -p 8080:8080 \
     -e GEMINI_API_KEY=your_key \
     -e GOOGLE_CLOUD_PROJECT_ID=your_project \
     therapy-ai
   ```

### Option 3: Manual VPS Deployment

#### Prerequisites

- Ubuntu 20.04+ VPS
- Node.js 18+
- PM2 for process management
- Nginx for reverse proxy

#### Steps

1. **Clone repository**:

   ```bash
   git clone your-repo-url
   cd TherapyAI-demo
   ```

2. **Install dependencies**:

   ```bash
   # Frontend
   cd web
   npm install
   npm run build

   # Backend
   cd ../server
   npm install
   ```

3. **Set up PM2**:

   ```bash
   npm install -g pm2

   # Start backend
   cd server
   pm2 start index.ts --name "therapy-ai-backend"

   # Start frontend
   cd ../web
   pm2 start npm --name "therapy-ai-frontend" -- start
   ```

4. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
       }

       location /api {
           proxy_pass http://localhost:3001;
       }

       location /ws {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }
   ```

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_WS_URL=wss://your-backend-url.com
```

### Backend (.env)

```
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_SERVICE_ACCOUNT_KEY=your_service_account_json
NODE_ENV=production
PORT=3001
WS_PORT=8080
```

## Post-Deployment Checklist

- [ ] Test frontend loads correctly
- [ ] Test API endpoints work
- [ ] Test WebSocket connection
- [ ] Test file upload functionality
- [ ] Test authentication flow
- [ ] Test persona management
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring/logging
- [ ] Configure backups

## Troubleshooting

### Common Issues

1. **CORS errors**: Check API_URL configuration
2. **WebSocket connection failed**: Check WS_URL and proxy settings
3. **File upload fails**: Check multer configuration and file permissions
4. **Authentication fails**: Check GCP credentials and environment variables

### Logs

- **Frontend**: Check browser console and Vercel logs
- **Backend**: Check Railway logs or PM2 logs (`pm2 logs`)
- **Docker**: Check container logs (`docker logs container_name`)

## Security Considerations

- Use HTTPS in production
- Keep API keys secure
- Implement rate limiting
- Use proper CORS configuration
- Regular security updates
- Monitor for suspicious activity
