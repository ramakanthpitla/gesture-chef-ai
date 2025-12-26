# AI Backend Features Documentation

## Overview

ChefAI integrates with multiple AI services to provide intelligent recipe generation and video recommendations. The application is designed to work seamlessly with or without API keys - defaulting to high-quality mock data when APIs are unavailable.

## Features

### 1. AI Recipe Generation (OpenAI Integration)

The recipe generation feature uses OpenAI's GPT-3.5 model to create personalized, detailed recipes based on:

- **Available Ingredients**: The AI will craft recipes using ingredients you have on hand
- **Time Constraints**: Specify maximum cooking time, and the AI will respect that limit
- **Dietary Restrictions**: Support for vegetarian, vegan, gluten-free, dairy-free, nut-free, and more
- **Cuisine Preferences**: Choose from various cuisine types (Italian, Chinese, Mexican, Indian, etc.)
- **Difficulty Level**: Get recipes matched to your cooking skill level

#### How It Works

1. User inputs ingredients and preferences
2. The app sends a structured prompt to OpenAI API
3. AI generates a complete recipe with:
   - Ingredient list with measurements
   - Step-by-step cooking instructions
   - Estimated prep and cook times
   - Cooking tips and tricks
   - Difficulty rating and serving size

#### Configuration

Add your OpenAI API key to the `.env` file:

```bash
VITE_OPENAI_API_KEY="sk-your-api-key-here"
```

**Cost Consideration**: Each recipe generation typically uses 500-1500 tokens, costing approximately $0.001-0.003 per request with GPT-3.5-turbo.

### 2. YouTube Video Recommendations

The YouTube integration provides relevant cooking videos and tutorials based on:

- Generated recipe ingredients
- Search queries from the user
- Recipe names and cuisine types

#### Features

- Real-time video search
- View counts and engagement metrics
- Video thumbnails and descriptions
- Channel information
- Publication dates

#### Configuration

Add your YouTube Data API key to the `.env` file:

```bash
VITE_YOUTUBE_API_KEY="your-youtube-api-key-here"
```

**Quota Consideration**: YouTube Data API has a daily quota of 10,000 units. Each video search uses approximately 100 units, allowing ~100 searches per day.

### 3. Fallback System

When API keys are not configured or APIs are unavailable:

- **Recipe Generation**: Uses intelligent mock data generator that still customizes based on user input
- **Video Search**: Returns curated mock video data with realistic thumbnails

This ensures the app remains functional for:
- Development and testing
- Demo purposes
- Users who prefer not to use external APIs

## API Setup Guides

### Getting an OpenAI API Key

1. Visit [https://platform.openai.com](https://platform.openai.com)
2. Create an account or log in
3. Navigate to API Keys section: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key and add it to your `.env` file
6. **Important**: Add billing information to your OpenAI account to enable API usage

### Getting a YouTube Data API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3:
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key
5. (Optional) Restrict the API key:
   - Click on the created API key
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Add your website domain to "HTTP referrers"

## Environment Variables Reference

```bash
# Required for database features (already configured)
VITE_SUPABASE_PROJECT_ID="..."
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="..."

# Optional AI Features
VITE_OPENAI_API_KEY=""           # OpenAI API key for recipe generation
VITE_YOUTUBE_API_KEY=""          # YouTube Data API for video recommendations
```

## Architecture

### Service Layer Structure

```
src/services/
├── aiRecipeService.ts       # AI-powered recipe generation
├── recipeService.ts          # Main recipe service (exports from aiRecipeService)
```

### Key Functions

#### `generateRecipe(request: RecipeGenerationRequest): Promise<Recipe>`

Generates a complete recipe based on user input. Automatically falls back to mock data if OpenAI API is not available.

**Request Parameters:**
- `ingredients`: Array of ingredient names
- `maxTime`: Maximum cooking time in minutes
- `dietaryRestrictions`: Array of dietary restrictions (optional)
- `cuisine`: Preferred cuisine type (optional)
- `difficulty`: Preferred difficulty level (optional)

#### `searchYouTubeVideos(query: string): Promise<YouTubeVideo[]>`

Searches for cooking videos related to the query. Returns mock data if YouTube API is not available.

**Returns:** Array of video objects with:
- Video ID, title, and description
- Channel information
- Thumbnail URLs
- View counts and publish dates

## Performance Optimization

1. **Caching**: API responses can be cached to reduce costs and improve speed
2. **Rate Limiting**: Built-in retry logic for API failures
3. **Lazy Loading**: Videos load only when needed
4. **Error Handling**: Graceful degradation to mock data on errors

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Rotate API keys** regularly
3. **Use environment-specific keys** for development and production
4. **Monitor API usage** and set up billing alerts
5. **Restrict API keys** by domain and API type

## Troubleshooting

### OpenAI API Issues

- **Error: Invalid API Key**: Double-check the key in your `.env` file
- **Error: Insufficient Quota**: Add billing details to your OpenAI account
- **Error: Rate Limit Exceeded**: Wait a few minutes or upgrade your plan

### YouTube API Issues

- **Error: Quota Exceeded**: Wait until the daily quota resets (midnight Pacific Time)
- **Error: API Not Enabled**: Ensure YouTube Data API v3 is enabled in Google Cloud Console
- **Error: Invalid Credentials**: Check that the API key is correctly copied

### General Issues

- **App still uses mock data**: Restart the development server after adding API keys
- **CORS errors**: API keys may need domain restrictions configured

## Future Enhancements

Potential features for future versions:

1. **Recipe Similarity Search**: Using Weaviate or similar vector database
2. **Image Generation**: AI-generated recipe images using DALL-E
3. **Nutrition Analysis**: Integration with nutrition APIs
4. **Multi-language Support**: Recipe generation in different languages
5. **User Profiles**: Save favorite recipes and preferences
6. **Shopping Lists**: Automatic generation from recipes
7. **Meal Planning**: AI-powered weekly meal plans

---

For questions or issues, please open an issue on GitHub or contact the development team.
