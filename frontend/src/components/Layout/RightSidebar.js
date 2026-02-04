import React from 'react';
import { X, Play, Pause, Music } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import useStore from '../../store/useStore';
import { formatDuration } from '../../utils/algorithms';
import { cn } from '../../lib/utils';

export const RightSidebar = () => {
  const queue = useStore(state => state.queue);
  const currentTrack = useStore(state => state.currentTrack);
  const currentTrackIndex = useStore(state => state.currentTrackIndex);
  const isPlaying = useStore(state => state.isPlaying);
  const playTrack = useStore(state => state.playTrack);
  const togglePlayPause = useStore(state => state.togglePlayPause);
  const clearQueue = useStore(state => state.clearQueue);

  if (queue.length === 0) {
    return (
      <div className="hidden xl:flex w-[350px] bg-spotify-dark rounded-lg flex-col h-full">
        <div className="p-4 border-b border-spotify">
          <h2 className="font-bold text-white">Queue</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Music className="w-16 h-16 mx-auto mb-3 text-[#b3b3b3] opacity-50" />
            <p className="text-sm text-[#b3b3b3]">No tracks in queue</p>
          </div>
        </div>
      </div>
    );
  }

  const handleTrackClick = (track, index) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track, index);
    }
  };

  return (
    <div className="hidden xl:flex w-[350px] bg-spotify-dark rounded-lg flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-spotify flex items-center justify-between">
        <h2 className="font-bold text-white">Queue</h2>
        <Button
          onClick={clearQueue}
          variant="ghost"
          size="sm"
          className="text-[#b3b3b3] hover:text-white h-8 px-3"
        >
          Clear
        </Button>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div className="p-4 border-b border-spotify">
          <p className="text-xs text-[#b3b3b3] font-semibold mb-3">NOW PLAYING</p>
          <div className="flex items-center gap-3">
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.album}
              className="w-12 h-12 rounded-md"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {currentTrack.name}
              </div>
              <div className="text-xs text-[#b3b3b3] truncate">
                {currentTrack.artist}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <p className="text-xs text-[#b3b3b3] font-semibold px-2 mb-2">NEXT IN QUEUE</p>
          {queue.map((track, index) => {
            if (index <= currentTrackIndex) return null;
            
            return (
              <div
                key={`${track.id}-${index}`}
                onClick={() => handleTrackClick(track, index)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#2a2a2a] cursor-pointer group"
              >
                <img
                  src={track.albumArt}
                  alt={track.album}
                  className="w-10 h-10 rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate group-hover:underline">
                    {track.name}
                  </div>
                  <div className="text-xs text-[#b3b3b3] truncate">
                    {track.artist}
                  </div>
                </div>
                <div className="text-xs text-[#b3b3b3]">
                  {formatDuration(track.duration)}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};