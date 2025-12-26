# Quick Start Guide: AI Features

## 🚀 Get Started in 5 Minutes

This guide will help you quickly set up and use the AI-powered features in ChefAI.

## Option 1: Use Without API Keys (Instant Start)

The easiest way to get started - **zero configuration required**!

```bash
npm install
npm run dev
```

Visit `http://localhost:8081` and start using ChefAI immediately with intelligent mock data.

**Perfect for:**
- Testing the app
- Development
- Demo purposes
- Users who don't need real AI features

---

## Option 2: Enable Full AI Power (Recommended)

Get real AI-generated recipes and YouTube video recommendations.

### Step 1: Get API Keys

#### OpenAI API Key (Required for AI Recipes)
1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

**Cost:** ~$0.001 per recipe (very affordable!)

#### YouTube API Key (Optional - for Video Search)
1. Go to: https://console.cloud.google.com/apis/credentials
2. Create a project (or select existing)
3. Enable "YouTube Data API v3"
4. Create an API key
5. Copy the key

**Cost:** Free (10,000 units/day quota)

### Step 2: Add Keys to `.env`

Open `.env` file and add your keys:

```bash
# Your existing Supabase config (leave as is)
VITE_SUPABASE_PROJECT_ID="fgzzbidxugenafixqjke"
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="https://fgzzbidxugenafixqjke.supabase.co"

# Add these lines:
VITE_OPENAI_API_KEY="sk-your-actual-key-here"
VITE_YOUTUBE_API_KEY="your-youtube-key-here"
```

### Step 3: Restart the Server

```bash
# Stop the current server (Ctrl+C if running)
npm run dev
```

That's it! You now have full AI power! 🎉

---

## 🎯 How to Use

### Generate an AI Recipe

1. **Add Ingredients**
   - Type in the input box: "chicken, tomatoes, pasta"
   - Or use voice: Click mic and speak

2. **Set Preferences** (Optional)
   - Max Time: 30 minutes
   - Dietary: Gluten-free, Vegan, etc.
   - Cuisine: Italian, Chinese, etc.

3. **Generate Recipe**
   - Click "Generate Recipe"
   - Watch as AI creates a custom recipe!
   - Get detailed steps, timings, and tips

4. **Watch Videos**
   - Scroll to the video section
   - See real YouTube cooking tutorials
   - Click to watch on YouTube

### Use Gesture Controls

1. **Enable Camera**
   - Click "Enable Gestures" button
   - Allow camera permissions

2. **Control Hands-Free**
   - 👆 Point up: Scroll up
   - 👇 Point down: Scroll down
   - ✋ Open palm: Select/Click
   - Perfect for when your hands are messy!

---

## 🔍 What's Different with AI?

### Without API Keys (Mock Mode)
- ✅ Still generates customized recipes
- ✅ Includes steps and cooking tips
- ✅ Shows curated cooking videos
- ⚠️ Less varied recipe suggestions
- ⚠️ Generic video recommendations

### With API Keys (Full AI Mode)
- ✅ Real AI-generated recipes
- ✅ Considers all your preferences
- ✅ Unique recipes every time
- ✅ Real YouTube search results
- ✅ Personalized recommendations
- ✅ Better ingredient combinations

---

## 💡 Pro Tips

### Save Money on OpenAI
1. Cache recipes you like (save to favorites)
2. Use mock mode for testing
3. Set up billing alerts in OpenAI dashboard
4. Each recipe costs less than a penny!

### YouTube API Quota
- Free tier: 10,000 units/day
- Each search: ~100 units
- You can do 100+ searches daily for free
- Quota resets at midnight Pacific Time

### Best Practices
1. Start with mock mode to learn the app
2. Add OpenAI key when you're ready
3. YouTube key is optional but recommended
4. Keep your API keys secret (never share!)

---

## 🐛 Troubleshooting

### "Still seeing mock recipes"
- ✅ Check your `.env` file has the API key
- ✅ Make sure key doesn't have extra spaces
- ✅ Restart the dev server after adding keys

### "OpenAI error"
- ✅ Verify your API key is correct
- ✅ Check you have billing enabled in OpenAI
- ✅ Look in browser console for error details

### "YouTube videos not loading"
- ✅ Check YouTube API key is correct
- ✅ Ensure YouTube Data API v3 is enabled
- ✅ Check if you've exceeded daily quota

### "Gesture controls not working"
- ✅ Allow camera permissions
- ✅ Ensure good lighting
- ✅ Keep hand clearly visible to camera

---

## 📊 Example: Your First AI Recipe

Let's create a recipe together:

```
1. Ingredients: "eggs, cheese, spinach, onion"
2. Max Time: 20 minutes
3. Dietary: Vegetarian
4. Click "Generate Recipe"
```

**Expected Result with AI:**
- Personalized recipe (e.g., "Spinach and Cheese Frittata")
- 8-10 detailed cooking steps
- Prep/cook time breakdown
- Professional cooking tips
- Nutrition-conscious suggestions

**Expected Result without AI:**
- Generic customized recipe
- 4-6 basic steps
- Simple cooking instructions
- Still usable and helpful!

---

## 🎓 Learn More

- **Full Documentation**: See `AI_BACKEND_DOCS.md`
- **Migration Details**: See `MIGRATION_SUMMARY.md`
- **General Info**: See `README.md`

---

## ⚙️ Configuration Reference

### Minimum Setup (Works Immediately)
```bash
# Just these three (already in .env)
VITE_SUPABASE_PROJECT_ID="..."
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="..."
```

### Recommended Setup (Full Features)
```bash
# Above three plus:
VITE_OPENAI_API_KEY="sk-..."
VITE_YOUTUBE_API_KEY="AIza..."
```

---

## 🎉 You're All Set!

ChefAI is now ready to help you cook amazing meals!

**Enjoy cooking with AI! 👨‍🍳🤖**
