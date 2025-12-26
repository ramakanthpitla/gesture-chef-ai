export interface Ingredient {
  id: string;
  name: string;
  amount?: string;
  unit?: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  duration?: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine?: string;
  tags: string[];
  imageUrl?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  description: string;
  publishedAt: string;
  viewCount?: string;
}

export interface RecipeGenerationRequest {
  ingredients: string[];
  maxTime: number;
  preferences?: string[];
  dietaryRestrictions?: string[];
  cuisine?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}
