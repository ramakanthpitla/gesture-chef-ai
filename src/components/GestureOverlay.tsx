import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Camera, CameraOff, MousePointer2, ArrowUp, ArrowDown } from 'lucide-react';
import { GestureType } from '@/hooks/useGesturePointer';
import { Button } from './ui/button';

interface GestureOverlayProps {
  isActive: boolean;
  currentGesture: GestureType;
  onToggle: () => void;
}

const gestureIcons: Record<string, React.ReactNode> = {
  swipe_up: <ArrowUp className="w-6 h-6" />,
  swipe_down: <ArrowDown className="w-6 h-6" />,
  point: <MousePointer2 className="w-6 h-6" />,
  pinch: <Hand className="w-6 h-6" />,
  click: <MousePointer2 className="w-6 h-6" />,
  palm: <Hand className="w-6 h-6" />,
};

const gestureLabels: Record<string, string> = {
  swipe_up: 'Scroll Up',
  swipe_down: 'Scroll Down',
  point: 'Point to Aim',
  pinch: 'Pinch to Click',
  click: 'Clicking!',
  palm: 'Palm',
};

export const GestureOverlay = ({ isActive, currentGesture, onToggle }: GestureOverlayProps) => {
  return (
    <>
      {/* Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <Button
          variant={isActive ? "default" : "outline"}
          size="icon-lg"
          onClick={onToggle}
          className={`shadow-medium ${isActive ? 'gesture-indicator' : ''}`}
        >
          {isActive ? (
            <Camera className="w-6 h-6" />
          ) : (
            <CameraOff className="w-6 h-6" />
          )}
        </Button>
      </motion.div>

      {/* Gesture Feedback */}
      <AnimatePresence>
        {currentGesture && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="bg-background/95 backdrop-blur-lg rounded-3xl p-8 shadow-glow border border-primary/20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {gestureIcons[currentGesture] || <Hand className="w-8 h-8" />}
                </div>
                <span className="text-lg font-medium text-foreground">
                  {gestureLabels[currentGesture] || currentGesture}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Preview (small corner) */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed bottom-24 right-6 z-40"
        >
          <div className="w-32 h-24 rounded-xl overflow-hidden bg-black/90 border-2 border-primary/30 shadow-medium">
            <video
              id="gesture-video"
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          </div>
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-accent animate-pulse" />
        </motion.div>
      )}

      {/* Updated Gesture Guide */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-6 z-40 hidden lg:block"
        >
          <div className="bg-background/95 backdrop-blur-lg rounded-2xl p-5 shadow-soft border border-border max-w-xs">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-primary">
              <Hand className="w-4 h-4" />
              Gesture Controls
            </h4>
            <div className="space-y-3 text-xs">
              <div className="bg-primary/5 rounded-lg p-2 border border-primary/20">
                <div className="flex items-center gap-2 font-semibold text-primary mb-1">
                  <MousePointer2 className="w-4 h-4" />
                  Pointer Mode
                </div>
                <div className="space-y-1 text-muted-foreground ml-6">
                  <div>👆 Point finger → Aim pointer</div>
                  <div>👌 Pinch → Click element</div>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-lg p-2">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <ArrowUp className="w-4 h-4" />
                  Scroll
                </div>
                <div className="space-y-1 text-muted-foreground ml-6">
                  <div>↑ Swipe up → Scroll up</div>
                  <div>↓ Swipe down → Scroll down</div>
                  <div className="text-xs text-primary mt-1">Or use arrow buttons →</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

