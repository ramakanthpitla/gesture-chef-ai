import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

export const ScrollButtons = () => {
    const scrollTo = (direction: 'up' | 'down') => {
        const scrollAmount = 400;
        window.scrollBy({
            top: direction === 'down' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <motion.div
            className="fixed right-6 bottom-32 z-40 flex flex-col gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
        >
            {/* Scroll Up Button */}
            <Button
                variant="secondary"
                size="icon-lg"
                onClick={() => scrollTo('up')}
                className="shadow-lg hover:shadow-xl transition-all bg-primary/90 hover:bg-primary text-white border-2 border-white/20"
                title="Scroll Up (or swipe hand up)"
                data-clickable="true"
            >
                <ChevronUp className="w-6 h-6" strokeWidth={3} />
            </Button>

            {/* Scroll Down Button */}
            <Button
                variant="secondary"
                size="icon-lg"
                onClick={() => scrollTo('down')}
                className="shadow-lg hover:shadow-xl transition-all bg-primary/90 hover:bg-primary text-white border-2 border-white/20"
                title="Scroll Down (or swipe hand down)"
                data-clickable="true"
            >
                <ChevronDown className="w-6 h-6" strokeWidth={3} />
            </Button>

            {/* Label */}
            <div className="bg-background/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md border border-border text-xs text-center">
                Scroll
            </div>
        </motion.div>
    );
};
