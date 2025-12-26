import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { YouTubeVideo } from '@/types/recipe';
import { Button } from './ui/button';

interface YouTubePlayerProps {
    video: YouTubeVideo | null;
    onClose: () => void;
}

export const YouTubePlayer = ({ video, onClose }: YouTubePlayerProps) => {
    if (!video) return null;

    const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="relative w-full max-w-5xl bg-background rounded-2xl shadow-2xl overflow-hidden"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/20">
                        <div className="flex-1 mr-4">
                            <h3 className="text-lg font-semibold line-clamp-1">{video.title}</h3>
                            <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                                title="Open in YouTube"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={embedUrl}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>

                    {/* Description */}
                    <div className="p-4 bg-secondary/10">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {video.description}
                        </p>
                        {video.viewCount && (
                            <p className="text-xs text-muted-foreground mt-2">
                                {video.viewCount} views
                            </p>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
