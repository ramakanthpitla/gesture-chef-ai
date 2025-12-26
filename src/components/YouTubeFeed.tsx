import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Youtube, Clock, Eye } from 'lucide-react';
import { YouTubeVideo } from '@/types/recipe';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { YouTubePlayer } from './YouTubePlayer';

interface YouTubeFeedProps {
  videos: YouTubeVideo[];
  isLoading: boolean;
  searchQuery: string;
}

export const YouTubeFeed = ({ videos, isLoading, searchQuery }: YouTubeFeedProps) => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  if (!searchQuery && videos.length === 0) return null;

  return (
    <>
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-4">
              <Youtube className="w-4 h-4" />
              <span className="text-sm font-medium">Related Videos</span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Learn from the Best Chefs
            </h2>
            <p className="text-muted-foreground mt-2">
              Watch tutorials and cooking guides for your recipe
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-recipe overflow-hidden animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <div className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-recipe overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="icon-lg"
                        className="rounded-full pointer-events-none"
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>

                    {video.viewCount && (
                      <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                        <Eye className="w-3 h-3 mr-1" />
                        {video.viewCount}
                      </Badge>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3">
                      {video.channelTitle}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                      >
                        Watch Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Youtube className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No videos found. Try generating a recipe first!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Embedded YouTube Player Modal */}
      <YouTubePlayer
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
};

