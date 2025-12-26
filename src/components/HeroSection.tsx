import { motion } from 'framer-motion';
import { Sparkles, Clock, Mic, MicOff, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import heroImage from '@/assets/hero-food.jpg';

interface HeroSectionProps {
  ingredients: string[];
  inputValue: string;
  timeMinutes: number;
  isListening: boolean;
  voiceTranscript: string;
  onInputChange: (value: string) => void;
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onTimeChange: (time: number) => void;
  onToggleVoice: () => void;
  onGenerateRecipe: () => void;
  isGenerating: boolean;
}

const timeOptions = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hrs', value: 90 },
  { label: '2+ hrs', value: 120 },
];

const suggestedIngredients = [
  'Chicken', 'Pasta', 'Tomatoes', 'Garlic', 'Onion', 
  'Rice', 'Eggs', 'Cheese', 'Beef', 'Salmon'
];

export const HeroSection = ({
  ingredients,
  inputValue,
  timeMinutes,
  isListening,
  voiceTranscript,
  onInputChange,
  onAddIngredient,
  onRemoveIngredient,
  onTimeChange,
  onToggleVoice,
  onGenerateRecipe,
  isGenerating,
}: HeroSectionProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAddIngredient(inputValue.trim());
      onInputChange('');
    }
  };

  return (
    <section className="relative min-h-screen pt-24 pb-12 overflow-hidden">
      {/* Background decoration with hero image */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-10">
          <img src={heroImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Recipe Generation</span>
          </motion.div>

          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Cook Anything with
            <span className="text-gradient block mt-2">What You Have</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your ingredients, set your time, and let AI create the perfect recipe. 
            Use gestures or voice for hands-free control while cooking.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Ingredient Input */}
          <div className="card-recipe p-6 mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Your Ingredients
            </label>
            
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={isListening ? voiceTranscript || "Listening..." : "Type an ingredient..."}
                  value={inputValue}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 h-12 rounded-xl border-border bg-background"
                />
              </div>
              
              <Button
                variant={isListening ? "default" : "outline"}
                size="icon-lg"
                onClick={onToggleVoice}
                className={isListening ? 'listening' : ''}
              >
                {isListening ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Selected Ingredients */}
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {ingredients.map((ingredient) => (
                  <motion.div
                    key={ingredient}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Badge
                      variant="secondary"
                      className="ingredient-tag cursor-pointer hover:bg-destructive/20 hover:text-destructive"
                      onClick={() => onRemoveIngredient(ingredient)}
                    >
                      {ingredient} ×
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Suggested Ingredients */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground mr-2 py-1">Suggestions:</span>
              {suggestedIngredients
                .filter(i => !ingredients.includes(i))
                .slice(0, 6)
                .map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => onAddIngredient(ingredient)}
                  >
                    + {ingredient}
                  </Badge>
                ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="card-recipe p-6 mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
              <Clock className="w-4 h-4 text-primary" />
              Available Cooking Time
            </label>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {timeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={timeMinutes === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTimeChange(option.value)}
                  className="rounded-xl"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              onClick={onGenerateRecipe}
              disabled={ingredients.length === 0 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Generating Recipe...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Recipe
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
