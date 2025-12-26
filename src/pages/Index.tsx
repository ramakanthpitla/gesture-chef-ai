import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { RecipeDisplay } from '@/components/RecipeDisplay';
import { YouTubeFeed } from '@/components/YouTubeFeed';
import { GestureOverlay } from '@/components/GestureOverlay';
import { GesturePointer } from '@/components/GesturePointer';
import { ScrollButtons } from '@/components/ScrollButtons';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useGestureControl, GestureType } from '@/hooks/useGesturePointer';
import { Recipe, YouTubeVideo } from '@/types/recipe';
import { generateRecipe, searchYouTubeVideos } from '@/services/recipeService';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const { toast } = useToast();

  // Ingredient state
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [timeMinutes, setTimeMinutes] = useState(30);

  // Recipe state
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // YouTube state
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  // Control modes
  const [gestureEnabled, setGestureEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Refs to avoid stale closures
  const currentStepRef = useRef(currentStep);
  const recipeRef = useRef(recipe);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    recipeRef.current = recipe;
  }, [recipe]);

  // Handler for adding ingredients
  const handleAddIngredient = useCallback((ingredient: string) => {
    setIngredients(prev => {
      if (!prev.includes(ingredient)) {
        toast({ title: 'Ingredient Added', description: ingredient });
        return [...prev, ingredient];
      }
      return prev;
    });
  }, [toast]);

  // Voice result handler
  const handleVoiceResult = useCallback((result: string) => {
    const lowerResult = result.toLowerCase().trim();

    // Voice commands
    if (lowerResult.includes('next') || lowerResult.includes('forward')) {
      if (recipeRef.current && currentStepRef.current < recipeRef.current.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        toast({ title: 'Next Step', description: `Moving to step ${currentStepRef.current + 2}` });
      }
    } else if (lowerResult.includes('previous') || lowerResult.includes('back')) {
      if (currentStepRef.current > 0) {
        setCurrentStep(prev => prev - 1);
        toast({ title: 'Previous Step', description: `Moving to step ${currentStepRef.current}` });
      }
    } else if (lowerResult.includes('play') || lowerResult.includes('start')) {
      setIsPlaying(true);
      toast({ title: 'Auto-play started' });
    } else if (lowerResult.includes('stop') || lowerResult.includes('pause')) {
      setIsPlaying(false);
      toast({ title: 'Auto-play paused' });
    } else {
      // Add as ingredient
      if (result.trim()) {
        handleAddIngredient(result.trim());
      }
    }
  }, [toast, handleAddIngredient]);

  // Voice error handler
  const handleVoiceError = useCallback((error: string) => {
    toast({ title: 'Voice Error', description: error, variant: 'destructive' });
  }, [toast]);

  // Voice input hook
  const { isListening, transcript, startListening, stopListening, isSupported: voiceSupported } = useVoiceInput({
    onResult: handleVoiceResult,
    onError: handleVoiceError,
    continuous: true,
  });

  // Gesture handler
  const handleGesture = useCallback((gesture: GestureType) => {
    if (!gesture) return;

    switch (gesture) {
      case 'swipe_left':
        if (currentStepRef.current > 0) {
          setCurrentStep(prev => prev - 1);
          toast({ title: 'Previous Step' });
        }
        break;
      case 'swipe_right':
        if (recipeRef.current && currentStepRef.current < recipeRef.current.steps.length - 1) {
          setCurrentStep(prev => prev + 1);
          toast({ title: 'Next Step' });
        }
        break;
      case 'thumbs_up':
        toast({ title: 'Great!' });
        break;
      case 'palm':
        setIsPlaying(false);
        toast({ title: 'Paused' });
        break;
    }
  }, [toast]);

  // Gesture control hook with pointer
  const {
    isActive: gestureActive,
    currentGesture,
    startCamera,
    stopCamera,
    handPosition,
    isPointing,
    isPinching,
  } = useGestureControl({
    onGesture: handleGesture,
    enabled: gestureEnabled,
    enablePointer: true, // Enable pointer mode
  });

  // Auto-play timer
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && recipe) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < recipe.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 10000); // 10 seconds per step
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, recipe]);

  const handleRemoveIngredient = useCallback((ingredient: string) => {
    setIngredients(prev => prev.filter(i => i !== ingredient));
  }, []);

  const handleGenerateRecipe = useCallback(async () => {
    if (ingredients.length === 0) {
      toast({ title: 'Add Ingredients', description: 'Please add at least one ingredient', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);

    try {
      const generatedRecipe = await generateRecipe({
        ingredients,
        maxTime: timeMinutes,
      });

      setRecipe(generatedRecipe);
      toast({ title: 'Recipe Generated!', description: generatedRecipe.title });

      // Search for related videos
      setIsLoadingVideos(true);
      const searchQuery = `${ingredients.slice(0, 2).join(' ')} recipe`;
      const youtubeVideos = await searchYouTubeVideos(searchQuery);
      setVideos(youtubeVideos);
      setIsLoadingVideos(false);

      // Scroll to recipe
      setTimeout(() => {
        document.getElementById('recipe-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate recipe', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  }, [ingredients, timeMinutes, toast]);

  const handleToggleGesture = useCallback(async () => {
    if (gestureEnabled) {
      stopCamera();
      setGestureEnabled(false);
      toast({ title: 'Gesture Control Disabled' });
    } else {
      const stream = await startCamera();
      if (stream) {
        const video = document.getElementById('gesture-video') as HTMLVideoElement;
        if (video) {
          video.srcObject = stream;
        }
        setGestureEnabled(true);
        toast({ title: 'Gesture Control Enabled', description: 'Use hand gestures to navigate' });
      } else {
        toast({ title: 'Camera Error', description: 'Could not access camera', variant: 'destructive' });
      }
    }
  }, [gestureEnabled, startCamera, stopCamera, toast]);

  const handleToggleVoice = useCallback(() => {
    if (!voiceSupported) {
      toast({ title: 'Not Supported', description: 'Voice input is not supported in this browser', variant: 'destructive' });
      return;
    }

    if (voiceEnabled) {
      stopListening();
      setVoiceEnabled(false);
      toast({ title: 'Voice Input Disabled' });
    } else {
      startListening();
      setVoiceEnabled(true);
      toast({ title: 'Voice Input Enabled', description: 'Speak to add ingredients or navigate' });
    }
  }, [voiceEnabled, voiceSupported, startListening, stopListening, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        gestureEnabled={gestureEnabled}
        voiceEnabled={voiceEnabled}
        onToggleGesture={handleToggleGesture}
        onToggleVoice={handleToggleVoice}
      />

      <main>
        <HeroSection
          ingredients={ingredients}
          inputValue={inputValue}
          timeMinutes={timeMinutes}
          isListening={isListening}
          voiceTranscript={transcript}
          onInputChange={setInputValue}
          onAddIngredient={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
          onTimeChange={setTimeMinutes}
          onToggleVoice={handleToggleVoice}
          onGenerateRecipe={handleGenerateRecipe}
          isGenerating={isGenerating}
        />

        <div id="recipe-section">
          <RecipeDisplay
            recipe={recipe}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
          />
        </div>

        <YouTubeFeed
          videos={videos}
          isLoading={isLoadingVideos}
          searchQuery={ingredients.join(' ')}
        />

        {/* Footer */}
        <footer className="py-8 border-t border-border bg-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Built with AI • Gesture & Voice Controls • Made for Hands-Free Cooking
            </p>
          </div>
        </footer>
      </main>

      <GestureOverlay
        isActive={gestureActive}
        currentGesture={currentGesture}
        onToggle={handleToggleGesture}
      />

      {/* Gesture-controlled pointer */}
      <GesturePointer
        x={handPosition.x}
        y={handPosition.y}
        isPointing={isPointing}
        isPinching={isPinching}
        isActive={gestureActive}
      />

      {/* Scroll Buttons */}
      <ScrollButtons />

      <Toaster />
    </div>
  );
};

export default Index;
