import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, ChefHat, Lightbulb, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';

interface RecipeDisplayProps {
  recipe: Recipe | null;
  currentStep: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const RecipeDisplay = ({
  recipe,
  currentStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
}: RecipeDisplayProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (recipe) {
      setProgress(((currentStep + 1) / recipe.steps.length) * 100);
    }
  }, [currentStep, recipe]);

  if (!recipe) return null;

  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < recipe.steps.length - 1;

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Recipe Header */}
        <div className="card-recipe p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-3">
                {recipe.difficulty}
              </Badge>
              
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                {recipe.title}
              </h2>
              
              <p className="text-muted-foreground mb-6">
                {recipe.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span><strong>Prep:</strong> {recipe.prepTime} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span><strong>Cook:</strong> {recipe.cookTime} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span><strong>Serves:</strong> {recipe.servings}</span>
                </div>
              </div>
            </div>
            
            {recipe.imageUrl && (
              <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden">
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Ingredients Summary */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ing) => (
                <Badge key={ing.id} variant="outline" className="text-sm">
                  {ing.amount} {ing.unit} {ing.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {recipe.steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary-glow"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="card-recipe p-8 mb-6"
          >
            <div className="step-card">
              <div className="step-number">
                {recipe.steps[currentStep].stepNumber}
              </div>
              
              <div>
                <p className="text-lg font-medium mb-4">
                  {recipe.steps[currentStep].instruction}
                </p>
                
                {recipe.steps[currentStep].duration && (
                  <Badge className="time-badge mb-4">
                    <Clock className="w-3 h-3 mr-1" />
                    {recipe.steps[currentStep].duration}
                  </Badge>
                )}
                
                {recipe.steps[currentStep].tip && (
                  <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-accent">Pro Tip</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {recipe.steps[currentStep].tip}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onStepChange(currentStep - 1)}
            disabled={!canGoBack}
            className="rounded-xl"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>
          
          <Button
            variant={isPlaying ? "secondary" : "default"}
            size="icon-lg"
            onClick={onTogglePlay}
            className="rounded-full"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
          
          <Button
            variant="default"
            size="lg"
            onClick={() => onStepChange(currentStep + 1)}
            disabled={!canGoForward}
            className="rounded-xl"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Gesture Hint */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Use <strong>swipe left/right</strong> gestures or <strong>say "next"/"previous"</strong> to navigate
        </p>
      </div>
    </motion.section>
  );
};
