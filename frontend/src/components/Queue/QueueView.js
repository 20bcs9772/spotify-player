import React from 'react';
import { Play, Pause, X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import useStore from '../../store/useStore';
import { formatDuration } from '../../utils/algorithms';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export const QueueView = () => {
  const queue = useStore(state => state.queue);
  const currentTrack = useStore(state => state.currentTrack);
  const currentTrackIndex = useStore(state => state.currentTrackIndex);
  const isPlaying = useStore(state => state.isPlaying);
  const playTrack = useStore(state => state.playTrack);
  const togglePlayPause = useStore(state => state.togglePlayPause);
  const removeFromQueue = useStore(state => state.removeFromQueue);
  const clearQueue = useStore(state => state.clearQueue);

  const handleTrackClick = (track, index) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track, index);
    }
  };

  const handleRemoveTrack = (trackId, e) => {
    e.stopPropagation();
    removeFromQueue(trackId);
    toast.success('Track removed from queue');
  };

  const handleClearQueue = () => {
    clearQueue();
    toast.success('Queue cleared');
  };

  const totalDuration = queue.reduce((acc, track) => acc + (track.duration || 0), 0);

  if (queue.length === 0) {
    return (
      <div className="h-full flex flex-col bg-surface rounded-lg border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Queue</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-surface-elevated flex items-center justify-center">
              <Play className="w-12 h-12 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No queue yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Apply an algorithm from the control panel to generate your queue
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Queue</h2>
            <p className="text-sm text-muted-foreground">
              {queue.length} {queue.length === 1 ? 'track' : 'tracks'} • {formatDuration(totalDuration)}
            </p>
          </div>
          <Button
            onClick={handleClearQueue}
            variant="destructive"
            size="sm"
          >
            Clear Queue
          </Button>
        </div>
      </div>

      {/* Queue list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {queue.map((track, index) => {
            const isCurrent = currentTrack?.id === track.id;
            const isCurrentlyPlaying = isCurrent && isPlaying;

            return (
              <Card
                key={`${track.id}-${index}`}
                onClick={() => handleTrackClick(track, index)}
                className={cn(
                  "p-3 cursor-pointer transition-all duration-200 border-border",
                  isCurrent 
                    ? "bg-surface-elevated border-primary/50" 
                    : "hover:bg-surface-elevated"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Index / Play button */}
                  <div className="w-8 flex items-center justify-center flex-shrink-0">
                    {isCurrentlyPlaying ? (
                      <div className="flex gap-0.5 items-end h-4">
                        <div className="w-0.5 bg-primary animate-pulse" style={{ height: '60%' }} />
                        <div className="w-0.5 bg-primary animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
                        <div className="w-0.5 bg-primary animate-pulse" style={{ height: '80%', animationDelay: '0.4s' }} />
                      </div>
                    ) : isCurrent ? (
                      <Pause className="w-4 h-4 text-primary" />
                    ) : (
                      <span className="text-sm text-muted-foreground">{index + 1}</span>
                    )}
                  </div>

                  {/* Album art */}
                  <img
                    src={track.albumArt}
                    alt={track.album}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />

                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-medium truncate text-sm",
                      isCurrent && "text-primary"
                    )}>
                      {track.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {track.artist} • {track.album}
                    </div>
                    <div className="text-xs text-subdued mt-0.5">
                      {track.sourceName && `from ${track.sourceName}`}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-muted-foreground flex-shrink-0">
                    {formatDuration(track.duration)}
                  </div>

                  {/* Remove button */}
                  <Button
                    onClick={(e) => handleRemoveTrack(track.id, e)}
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};