import { Recipe, YouTubeVideo, RecipeGenerationRequest } from '@/types/recipe';

// Environment variables for API keys
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface YouTubeSearchResponse {
  items: Array<{
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      channelTitle: string;
      description: string;
      thumbnails: {
        medium: {
          url: string;
        };
      };
      publishedAt: string;
    };
  }>;
}

interface YouTubeVideoStatsResponse {
  items: Array<{
    statistics: {
      viewCount: string;
    };
  }>;
}

/**
 * Generate a recipe using OpenAI API
 */
export const generateRecipe = async (request: RecipeGenerationRequest): Promise<Recipe> => {
  try {
    // If API key is not configured, use fallback mock data
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using mock data');
      return generateMockRecipe(request);
    }

    const prompt = createRecipePrompt(request);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef and cooking assistant. Generate detailed, easy-to-follow recipes in JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ] as OpenAIMessage[],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    const recipeJson = data.choices[0].message.content;
    
    // Parse the JSON response
    const recipe = parseRecipeFromAI(recipeJson, request);
    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    // Fallback to mock data on error
    return generateMockRecipe(request);
  }
};

/**
 * Search YouTube videos related to the recipe
 */
export const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
  try {
    if (!YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured, using mock data');
      return getMockVideos(query);
    }

    // Search for videos
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=6&key=${YOUTUBE_API_KEY}`
    );

    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.statusText}`);
    }

    const searchData: YouTubeSearchResponse = await searchResponse.json();
    
    // Get video IDs
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    
    // Get video statistics
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    if (!statsResponse.ok) {
      throw new Error(`YouTube API error: ${statsResponse.statusText}`);
    }

    const statsData: YouTubeVideoStatsResponse = await statsResponse.json();
    
    // Combine search results with statistics
    const videos: YouTubeVideo[] = searchData.items.map((item, index) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      viewCount: formatViewCount(statsData.items[index]?.statistics.viewCount || '0'),
    }));

    return videos;
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    return getMockVideos(query);
  }
};

/**
 * Create a detailed prompt for recipe generation
 */
function createRecipePrompt(request: RecipeGenerationRequest): string {
  return `Generate a detailed recipe using these ingredients: ${request.ingredients.join(', ')}.

Requirements:
- Maximum cooking time: ${request.maxTime} minutes
${request.dietaryRestrictions?.length ? `- Dietary restrictions: ${request.dietaryRestrictions.join(', ')}` : ''}
${request.cuisine ? `- Cuisine type: ${request.cuisine}` : ''}
${request.difficulty ? `- Difficulty level: ${request.difficulty}` : ''}

Please respond with a JSON object in this exact format:
{
  "title": "Recipe name",
  "description": "Brief description",
  "ingredients": [
    {"name": "ingredient name", "amount": "quantity", "unit": "measurement unit"}
  ],
  "steps": [
    {
      "stepNumber": 1,
      "instruction": "Detailed instruction",
      "duration": "estimated time",
      "tip": "Optional cooking tip"
    }
  ],
  "prepTime": number,
  "cookTime": number,
  "totalTime": number,
  "servings": number,
  "difficulty": "Easy|Medium|Hard",
  "cuisine": "cuisine type",
  "tags": ["tag1", "tag2"]
}`;
}

/**
 * Parse AI-generated recipe JSON
 */
function parseRecipeFromAI(jsonString: string, request: RecipeGenerationRequest): Recipe {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = jsonString.match(/```json\n([\s\S]*?)\n```/) || jsonString.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : jsonString;
    
    const parsed = JSON.parse(cleanJson);
    
    return {
      id: Date.now().toString(),
      title: parsed.title || 'Generated Recipe',
      description: parsed.description || '',
      ingredients: parsed.ingredients?.map((ing: any, idx: number) => ({
        id: idx.toString(),
        name: ing.name || '',
        amount: ing.amount?.toString() || '1',
        unit: ing.unit || '',
      })) || [],
      steps: parsed.steps?.map((step: any) => ({
        stepNumber: step.stepNumber || 0,
        instruction: step.instruction || '',
        duration: step.duration,
        tip: step.tip,
      })) || [],
      prepTime: parsed.prepTime || 10,
      cookTime: parsed.cookTime || 20,
      totalTime: parsed.totalTime || request.maxTime,
      servings: parsed.servings || 4,
      difficulty: parsed.difficulty || 'Medium',
      cuisine: parsed.cuisine || request.cuisine || 'International',
      tags: parsed.tags || [],
    };
  } catch (error) {
    console.error('Error parsing AI recipe:', error);
    return generateMockRecipe(request);
  }
}

/**
 * Generate mock recipe as fallback
 */
function generateMockRecipe(request: RecipeGenerationRequest): Recipe {
  const ingredientsList = request.ingredients.map((ing, idx) => ({
    id: idx.toString(),
    name: ing,
    amount: '1',
    unit: 'portion',
  }));

  return {
    id: Date.now().toString(),
    title: `${request.ingredients.slice(0, 2).join(' & ')} Delight`,
    description: `A delicious recipe featuring ${request.ingredients.join(', ')} ready in ${request.maxTime} minutes.`,
    ingredients: ingredientsList,
    steps: [
      {
        stepNumber: 1,
        instruction: 'Prepare all ingredients by washing and chopping them as needed.',
        duration: '5 min',
        tip: 'Mise en place - having everything prepared makes cooking smoother.',
      },
      {
        stepNumber: 2,
        instruction: `Combine ${request.ingredients[0] || 'main ingredient'} with seasonings in a pan over medium heat.`,
        duration: '10 min',
      },
      {
        stepNumber: 3,
        instruction: `Add ${request.ingredients.slice(1).join(', ')} and cook until tender.`,
        duration: `${Math.max(5, request.maxTime - 20)} min`,
        tip: 'Taste and adjust seasoning as needed.',
      },
      {
        stepNumber: 4,
        instruction: 'Serve hot and enjoy!',
        duration: '2 min',
      },
    ],
    prepTime: 10,
    cookTime: Math.max(10, request.maxTime - 10),
    totalTime: request.maxTime,
    servings: 4,
    difficulty: request.difficulty || 'Easy',
    cuisine: request.cuisine || 'International',
    tags: request.ingredients.slice(0, 3),
  };
}

/**
 * Get mock YouTube videos as fallback
 */
function getMockVideos(query: string): YouTubeVideo[] {
  return [
    {
      id: 'recipe1',
      title: `How to Make ${query}`,
      channelTitle: 'Chef Master',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      description: `Learn how to make delicious ${query} with step-by-step instructions.`,
      publishedAt: new Date().toISOString(),
      viewCount: '2.5M',
    },
    {
      id: 'recipe2',
      title: `${query} - Quick \u0026 Easy Recipe`,
      channelTitle: 'Quick Cooking',
      thumbnailUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      description: `Fast and easy recipe for ${query}`,
      publishedAt: new Date().toISOString(),
      viewCount: '1.8M',
    },
    {
      id: 'recipe3',
      title: `Professional ${query} Techniques`,
      channelTitle: 'Pro Chef',
      thumbnailUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
      description: `Master the techniques for perfect ${query}`,
      publishedAt: new Date().toISOString(),
      viewCount: '3.2M',
    },
  ];
}

/**
 * Format view count to human-readable format
 */
function formatViewCount(count: string): string {
  const num = parseInt(count, 10);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return count;
}
