# HaMi - Render Deployment Guide

This guide will help you deploy HaMi (Menstrual Cycle Tracker) to Render.

## Prerequisites

- A Render account (free tier available)
- A MongoDB Atlas account (free tier available)
- GitHub account with your code pushed

## Step 1: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user with username and password
5. Get your connection string from the Atlas dashboard
6. Add your IP address to the IP whitelist (or use 0.0.0.0/0 for all IPs)

## Step 2: Backend Deployment (Render)

### 2.1 Create Web Service

1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: hami-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `MONGODB_URI`: Your MongoDB connection string
     - `FRONTEND_URL`: Your frontend URL (add after frontend deployment)
     - `PORT`: 5000

### 2.2 Environment Variables

Add these in Render Dashboard:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hami
FRONTEND_URL=https://your-frontend-url.onrender.com
PORT=5000
```

### 2.3 Deploy

Click "Create Web Service" and wait for deployment. Your backend URL will be:
`https://hami-backend.onrender.com`

## Step 3: Frontend Deployment (Render)

### 3.1 Create Web Service

1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository (same repo)
3. Configure the service:
   - **Name**: hami-frontend
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview` (or use static site deployment)
   - **Environment Variables**:
     - `VITE_API_URL`: Your backend URL

### 3.2 Environment Variables

Add these in Render Dashboard:
```
VITE_API_URL=https://hami-backend.onrender.com/api
```

### 3.3 Alternative: Static Site Deployment

For better performance, deploy as a static site:

1. Go to Render Dashboard → New → Static Site
2. Configure:
   - **Name**: hami-frontend
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: Your backend URL

### 3.4 Deploy

Click "Create Web Service" and wait for deployment. Your frontend URL will be:
`https://hami-frontend.onrender.com`

## Step 4: Update Backend CORS

After frontend deployment, update the backend environment variable:
```
FRONTEND_URL=https://hami-frontend.onrender.com
```

Then redeploy the backend.

## Step 5: Verify Deployment

1. Visit your frontend URL
2. Check browser console for any errors
3. Test the cycle tracking functionality
4. Verify PWA installation (should show install prompt on mobile)

## Important Notes

### MongoDB Connection String Format
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hami?retryWrites=true&w=majority
```

### Free Tier Limitations
- Render free tier spins down after 15 minutes of inactivity
- First request may take 30-60 seconds to wake up
- MongoDB free tier has 512MB storage limit

### PWA on Render
PWA features work best with HTTPS (Render provides this automatically)
Service worker will be generated during build process

### Troubleshooting

**Backend won't connect to MongoDB:**
- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Ensure database user has correct permissions

**Frontend can't reach backend:**
- Verify VITE_API_URL is set correctly
- Check CORS settings in backend
- Ensure backend is deployed and running

**PWA not installing:**
- Ensure site is served over HTTPS
- Check manifest.json is accessible
- Verify service worker is registered

## Production Checklist

- [ ] MongoDB cluster created and configured
- [ ] Backend deployed with correct environment variables
- [ ] Frontend deployed with VITE_API_URL set
- [ ] CORS configured with frontend URL
- [ ] Test cycle tracking end-to-end
- [ ] Verify PWA installation on mobile device
- [ ] Check all animations and features work correctly

## URLs After Deployment

- Backend: `https://hami-backend.onrender.com`
- Frontend: `https://hami-frontend.onrender.com`
- Health Check: `https://hami-backend.onrender.com/health`
