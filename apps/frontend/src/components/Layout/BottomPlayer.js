import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Mic2,
  ListMusic,
  Monitor
} from 'lucide-react';
import { Slider } from '../ui/slider';
import useStore from '../../store/useStore';
import { formatDuration } from '../../utils/algorithms';
import { cn } from '../../lib/utils';

export const BottomPlayer = () => {
  const isPlaying = useStore(state => state.isPlaying);
  const currentTrack = useStore(state => state.currentTrack);
  const currentTrackIndex = useStore(state => state.currentTrackIndex);
  const queue = useStore(state => state.queue);
  const togglePlayPause = useStore(state => state.togglePlayPause);
  const nextTrack = useStore(state => state.nextTrack);
  const previousTrack = useStore(state => state.previousTrack);

  const [progress, setProgress] = React.useState(0);
  const [volume, setVolume] = React.useState([70]);
  const [isShuffle, setIsShuffle] = React.useState(false);
  const [repeatMode, setRepeatMode] = React.useState(0); // 0: off, 1: all, 2: one

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
      <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-black border-t border-[#282828] z-50">
        <div className="h-full flex items-center justify-center">
          <p className="text-[#b3b3b3] text-sm">No track playing</p>
        </div>
      </div>
    );
  }

  const currentTime = currentTrack.duration ? (progress / 100) * currentTrack.duration : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-black border-t border-[#282828] z-50">
      <div className="h-full flex items-center justify-between px-4 gap-4">
        {/* Left - Track Info */}
        <div className="flex items-center gap-3 min-w-[180px] w-[30%]">
          <img
            src={currentTrack.albumArt}
            alt={currentTrack.album}
            className="w-14 h-14 rounded-md"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate hover:underline cursor-pointer">
              {currentTrack.name}
            </div>
            <div className="text-xs text-[#b3b3b3] truncate hover:underline cursor-pointer">
              {currentTrack.artist}
            </div>
          </div>
        </div>

        {/* Center - Playback Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-[722px]">
          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={cn(
                "transition-colors",
                isShuffle ? "text-[#1DB954]" : "text-[#b3b3b3] hover:text-white"
              )}
            >
              <Shuffle size={16} />
            </button>

            <button
              onClick={previousTrack}
              disabled={currentTrackIndex <= 0}
              className="text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipBack size={20} fill="currentColor" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause size={20} className="text-black" fill="currentColor" />
              ) : (
                <Play size={20} className="text-black ml-0.5" fill="currentColor" />
              )}
            </button>

            <button
              onClick={nextTrack}
              disabled={currentTrackIndex >= queue.length - 1}
              className="text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipForward size={20} fill="currentColor" />
            </button>

            <button
              onClick={() => setRepeatMode((repeatMode + 1) % 3)}
              className={cn(
                "transition-colors",
                repeatMode > 0 ? "text-[#1DB954]" : "text-[#b3b3b3] hover:text-white"
              )}
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-[#b3b3b3] min-w-[40px] text-right">
              {formatDuration(currentTime)}
            </span>
            <div className="flex-1 group cursor-pointer">
              <Slider
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                max={100}
                step={0.1}
                className="cursor-pointer"
              />
            </div>
            <span className="text-xs text-[#b3b3b3] min-w-[40px]">
              {formatDuration(currentTrack.duration)}
            </span>
          </div>
        </div>

        {/* Right - Extra Controls */}
        <div className="hidden lg:flex items-center gap-2 min-w-[180px] w-[30%] justify-end">
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <Mic2 size={16} />
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <ListMusic size={16} />
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <Monitor size={16} />
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <Volume2 size={16} />
          </button>
          <div className="w-24">
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};