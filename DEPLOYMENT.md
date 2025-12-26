# ChefAI - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works!)
- Git installed on your computer

---

## Step-by-Step Deployment

### 1. Initialize Git Repository

```bash
# Navigate to project directory
cd /Users/ramakanthpitla/Downloads/gesture-chef-ai-main

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: ChefAI - Gesture-Controlled AI Recipe Generator"
```

### 2. Create GitHub Repository

**Option A: Using GitHub CLI (if installed)**
```bash
gh repo create gesture-chef-ai --public --source=. --remote=origin --push
```

**Option B: Using GitHub Website**
1. Go to https://github.com/new
2. Repository name: `gesture-chef-ai`
3. Description: `AI-powered recipe generator with gesture and voice controls`
4. Choose: **Public** (or Private)
5. **Do NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

Then connect and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/gesture-chef-ai.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

#### Method 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? gesture-chef-ai
# - In which directory is your code? ./
# - Want to override settings? No
```

#### Method 2: Vercel Dashboard

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository `gesture-chef-ai`
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Add Environment Variables (optional):
   - `VITE_OPENAI_API_KEY` (for AI recipe generation)
   - `VITE_YOUTUBE_API_KEY` (for video recommendations)
   - `VITE_SUPABASE_*` (if using Supabase)
6. Click "Deploy"

---

## 🔑 Environment Variables Configuration

### Required for Vercel:
None! The app works with mock data by default.

### Optional (for full AI features):

**In Vercel Dashboard** → Your Project → Settings → Environment Variables:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_OPENAI_API_KEY` | OpenAI API key for recipe generation | https://platform.openai.com/api-keys |
| `VITE_YOUTUBE_API_KEY` | YouTube Data API v3 key | https://console.cloud.google.com/apis/credentials |
| `VITE_SUPABASE_URL` | Supabase project URL | https://app.supabase.com |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | Supabase dashboard |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | Supabase dashboard |

**After adding variables:**
1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Select "Use existing Build Cache" → No
4. Click "Redeploy"

---

## 🌐 Important: HTTPS for Camera & Microphone

### Why HTTPS is Required:
- **Camera access** (for gestures) requires HTTPS
- **Microphone access** (for voice) requires HTTPS
- Vercel provides HTTPS automatically ✅

### Local Development:
- `localhost` works without HTTPS ✅
- Local IP (192.168.x.x) may need HTTPS
- Use ngrok or Vercel dev for testing

---

## ✅ Post-Deployment Checklist

After successful deployment:

### 1. Test Camera Access
- [ ] Open your Vercel URL
- [ ] Click "Gestures" button
- [ ] Allow camera permission
- [ ] Verify camera feed shows in corner
- [ ] Verify pointer tracks hand movement

### 2. Test Voice Input
- [ ] Click "Voice" button
- [ ] Allow microphone permission
- [ ] Say an ingredient name
- [ ] Verify it gets added

### 3. Test AI Features
- [ ] Add ingredients
- [ ] Click "Generate Recipe"
- [ ] If API keys configured: Should get AI-generated recipe
- [ ] If no API keys: Should get intelligent mock recipe
- [ ] Verify YouTube videos load

### 4. Test Gesture Scrolling
- [ ] Enable gestures
- [ ] Try swipe up/down gestures
- [ ] Try clicking scroll arrow buttons with pointer
- [ ] Verify smooth scrolling

### 5. Test YouTube Embed
- [ ] Generate a recipe
- [ ] Scroll to videos section
- [ ] Click a video card
- [ ] Verify video plays in modal

---

## 🐛 Troubleshooting Deployment Issues

### Build Fails

**Error: `Module not found`**
```bash
# Solution: Reinstall dependencies
npm install
npm run build
```

**Error: `Type errors`**
```bash
# Solution: Check TypeScript
npm run type-check
```

### Environment Variables Not Working

**Symptoms:** API calls fail, still using mock data

**Solution:**
1. Verify variables in Vercel dashboard
2. Variables must start with `VITE_`
3. Redeploy after adding variables
4. Clear Vercel build cache

### Camera/Microphone Not Working

**Symptoms:** Permission denied or not working

**Possible Causes:**
1. Not using HTTPS → ✅ Vercel provides HTTPS
2. Browser doesn't support → Use Chrome/Edge/Safari
3. User denied permission → User must allow
4. Vercel headers not set → Check `vercel.json`

**Check Headers:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Permissions-Policy",
          "value": "camera=*, microphone=*, geolocation=()"
        }
      ]
    }
  ]
}
```

### Videos Not Loading

**Symptoms:** YouTube videos don't play

**Solutions:**
1. Check API key is set (if using real YouTube API)
2. Check API quota (YouTube limits requests)
3. Some videos are not embeddable (creator setting)
4. Try different videos

---

## 📊 Performance Optimization

### For Vercel Deployment:

1. **Enable Vercel Analytics** (free)
   - Dashboard → Analytics → Enable
   - Track page views and performance

2. **Enable Vercel Speed Insights**
   - Dashboard → Speed Insights → Enable
   - Monitor Core Web Vitals

3. **Set Deployment Regions**
   - Settings → Functions → Choose regions closest to users
   - Recommended: Auto (Vercel chooses optimal)

---

## 🔄 Continuous Deployment

Once connected to GitHub:

1. **Automatic deployments** on every push to `main`
2. **Preview deployments** for pull requests
3. **Instant rollbacks** from Vercel dashboard

### Update Workflow:
```bash
# Make changes locally
# Test locally
npm run dev

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Vercel automatically deploys! 🚀
```

---

## 📱 Custom Domain (Optional)

### Add Custom Domain:

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `chefai.com`)
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificate

---

## 🎯 Production Checklist

Before going live:

- [ ] All features tested on Vercel preview URL
- [ ] Camera access works
- [ ] Microphone access works
- [ ] Gestures working properly
- [ ] Voice input functional
- [ ] YouTube videos loading
- [ ] Mobile responsive
- [ ] Environment variables configured (if using APIs)
- [ ] Analytics enabled
- [ ] Custom domain configured (optional)

---

## 📞 Support

### If Issues Persist:

1. **Check Vercel Logs:**
   - Dashboard → Deployments → Click deployment → "Logs"

2. **Check Browser Console:**
   - F12 → Console tab
   - Look for errors

3. **Vercel Status:**
   - https://www.vercel-status.com

4. **GitHub Issues:**
   - Create issue in your repository

---

## 🎉 Success!

Your ChefAI app is now live at:
- **Vercel URL:** `https://gesture-chef-ai.vercel.app`
- **Custom Domain:** (if configured)

Share it with the world! 🌍

---

**Deployed by:** You  
**Platform:** Vercel  
**Framework:** Vite + React + TypeScript  
**Features:** AI Recipes, Gesture Control, Voice Input, YouTube Integration
