import { motion } from 'framer-motion';
import { ChefHat, Hand, Volume2 } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  gestureEnabled: boolean;
  voiceEnabled: boolean;
  onToggleGesture: () => void;
  onToggleVoice: () => void;
}

export const Header = ({ 
  gestureEnabled, 
  voiceEnabled, 
  onToggleGesture, 
  onToggleVoice 
}: HeaderProps) => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
            <ChefHat className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">ChefAI</h1>
            <p className="text-xs text-muted-foreground">Gesture-Controlled Recipes</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <Button
            variant={gestureEnabled ? "default" : "outline"}
            size="sm"
            onClick={onToggleGesture}
            className="flex items-center gap-2"
          >
            <Hand className="w-4 h-4" />
            <span className="hidden sm:inline">Gestures</span>
          </Button>
          
          <Button
            variant={voiceEnabled ? "default" : "outline"}
            size="sm"
            onClick={onToggleVoice}
            className="flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Voice</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
