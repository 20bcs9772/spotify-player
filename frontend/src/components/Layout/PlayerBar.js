import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import useStore from '../../store/useStore';
import { formatDuration } from '../../utils/algorithms';
import { cn } from '../../lib/utils';

export const PlayerBar = () => {
  const isPlaying = useStore(state => state.isPlaying);
  const currentTrack = useStore(state => state.currentTrack);
  const currentTrackIndex = useStore(state => state.currentTrackIndex);
  const queue = useStore(state => state.queue);
  const togglePlayPause = useStore(state => state.togglePlayPause);
  const nextTrack = useStore(state => state.nextTrack);
  const previousTrack = useStore(state => state.previousTrack);

  const [progress, setProgress] = React.useState(0);
  const [volume, setVolume] = React.useState([70]);

  // Simulate progress
  React.useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextTrack();
          return 0;
        }
        return prev + 0.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, nextTrack]);

  if (!currentTrack) {
    return (
      <div className="bg-surface-elevated border-t border-border p-4">
        <div className="text-center text-muted-foreground text-sm">
          Select a track from the queue to start playback
        </div>
      </div>
    );
  }

  const currentTime = currentTrack.duration ? (progress / 100) * currentTrack.duration : 0;

  return (
    <div className="bg-surface-elevated border-t border-border">
      {/* Progress bar */}
      <div className="px-4 pt-2">
        <Slider
          value={[progress]}
          onValueChange={(value) => setProgress(value[0])}
          max={100}
          step={0.1}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between gap-4">
        {/* Track info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {currentTrack.albumArt && (
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.album}
              className="w-14 h-14 rounded object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{currentTrack.name}</div>
            <div className="text-xs text-muted-foreground truncate">{currentTrack.artist}</div>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Shuffle className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={previousTrack}
            disabled={currentTrackIndex <= 0}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            onClick={togglePlayPause}
            className={cn(
              "w-10 h-10 rounded-full transition-all duration-300",
              "bg-primary hover:bg-primary-hover hover:scale-110",
              "shadow-lg hover:shadow-primary/50"
            )}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextTrack}
            disabled={currentTrackIndex >= queue.length - 1}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <SkipForward className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Repeat className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-end max-w-xs">
          <Volume2 className="w-5 h-5 text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};