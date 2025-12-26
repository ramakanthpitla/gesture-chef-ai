import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, Hand, Zap } from 'lucide-react';

interface GesturePointerProps {
    x: number;
    y: number;
    isPointing: boolean;
    isPinching: boolean;
    isActive: boolean;
}

export const GesturePointer = ({ x, y, isPointing, isPinching, isActive }: GesturePointerProps) => {
    // Always show pointer when gestures are enabled, even if hand not detected
    if (!isActive) return null;

    // Show at least idle state even if hand not detected
    const hasHand = x > 0 && y > 0;

    // Determine current state
    const isClicking = isPinching && hasHand;
    const isReady = isPointing && !isPinching && hasHand;
    const isIdle = !hasHand || (!isPointing && !isPinching);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed pointer-events-none z-[9999]"
                style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 600, damping: 35 }}
            >
                {/* Large outer glow ring - MORE VISIBLE */}
                <motion.div
                    className={`absolute inset-0 w-24 h-24 -ml-12 -mt-12 rounded-full blur-2xl ${isClicking
                        ? 'bg-green-500/60'
                        : isReady
                            ? 'bg-blue-500/50'
                            : 'bg-gray-400/30'
                        }`}
                    animate={{
                        scale: isClicking ? [1, 1.3, 1] : isReady ? 1.1 : 0.9,
                        opacity: isClicking ? [0.8, 1, 0.8] : isReady ? 0.7 : 0.4,
                    }}
                    transition={{
                        duration: isClicking ? 0.3 : 0.5,
                        repeat: isClicking ? Infinity : 0,
                    }}
                />

                {/* Main pointer circle - BIGGER AND MORE VISIBLE */}
                <motion.div
                    className={`relative w-16 h-16 -ml-8 -mt-8 rounded-full border-4 flex items-center justify-center shadow-2xl ${isClicking
                        ? 'bg-green-500 border-green-400 shadow-green-500/80'
                        : isReady
                            ? 'bg-blue-500 border-blue-400 shadow-blue-500/80'
                            : 'bg-gray-500 border-gray-400 shadow-gray-500/50'
                        }`}
                    animate={{
                        scale: isClicking ? 0.85 : isReady ? 1.05 : 0.95,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                    {isClicking ? (
                        <motion.div
                            className="flex items-center justify-center"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                        >
                            <Zap className="w-7 h-7 text-white fill-white" />
                        </motion.div>
                    ) : isReady ? (
                        <MousePointer2 className="w-7 h-7 text-white" strokeWidth={2.5} />
                    ) : (
                        <Hand className="w-7 h-7 text-white" strokeWidth={2} />
                    )}
                </motion.div>

                {/* Multiple ripple effects on clicking - MORE DRAMATIC */}
                {isClicking && (
                    <>
                        <motion.div
                            className="absolute inset-0 w-16 h-16 -ml-8 -mt-8 rounded-full border-4 border-green-400"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute inset-0 w-16 h-16 -ml-8 -mt-8 rounded-full border-3 border-green-300"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
                        />
                    </>
                )}

                {/* Status text - BIGGER AND CLEARER */}
                <motion.div
                    className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className={`px-4 py-2 rounded-xl shadow-xl border-2 text-sm font-bold ${isClicking
                        ? 'bg-green-500 border-green-400 text-white'
                        : isReady
                            ? 'bg-blue-500 border-blue-400 text-white'
                            : 'bg-gray-700 border-gray-600 text-white'
                        }`}>
                        {isClicking ? (
                            <span className="flex items-center gap-1.5">
                                <Zap className="w-4 h-4 fill-white" />
                                CLICKING!
                            </span>
                        ) : isReady ? (
                            <span>👌 PINCH TO CLICK</span>
                        ) : (
                            <span>👆 POINT TO AIM</span>
                        )}
                    </div>
                </motion.div>

                {/* Crosshair for precise aiming */}
                {isReady && (
                    <motion.div
                        className="absolute"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                    >
                        {/* Vertical line */}
                        <div className="absolute w-0.5 h-6 bg-blue-400 -ml-0.25 -mt-16" />
                        {/* Horizontal line */}
                        <div className="absolute w-6 h-0.5 bg-blue-400 -ml-10 -mt-0.25" />
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
