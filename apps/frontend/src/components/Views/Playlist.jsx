import { Clock, Plus } from "lucide-react";
import { formatDuration } from "../../utils/algorithms";
import useStore from "../../store/useStore";

export const PlaylistView = ({ onAddToPool }) => {
  const playlist = useStore((state) => state.selectedPlaylist);

  return (
    <div className="spotify-gradient-purple min-h-full">
      {/* Hero */}
      <div className="p-6 pb-6 flex items-end gap-6">
        <img
          src={playlist.image}
          alt={playlist.name}
          className="w-56 h-56 rounded-md shadow-2xl"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white mb-2">PLAYLIST</p>
          <h1 className="text-6xl font-black tracking-tighter mb-4">
            {playlist.name}
          </h1>
          <p className="text-[#b3b3b3] text-sm mb-2">{playlist.owner}</p>
          <p className="text-[#b3b3b3] text-sm">
            {playlist.tracks?.length || 0} songs
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => onAddToPool(playlist)}
          className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-lg"
        >
          <Plus className="w-6 h-6 text-black" />
        </button>
        <span className="text-sm text-[#b3b3b3]">Add to Staging Pool</span>
      </div>

      {/* Tracklist */}
      <div className="px-6 pb-6">
        <div className="sticky top-0 bg-[#121212]/95 backdrop-blur-md grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 border-b border-[#282828] text-[#b3b3b3] text-xs uppercase">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div className="flex justify-end">
            <Clock size={16} />
          </div>
        </div>
        {playlist.tracks && playlist.tracks.length > 0 ? (
          <div className="space-y-1">
            {playlist.tracks.map((track, index) => (
              <div
                key={track.id}
                className="group grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 hover:bg-[#2a2a2a] rounded-md items-center cursor-pointer"
              >
                <div className="text-[#b3b3b3] text-sm">{index + 1}</div>
                <div>
                  <div className="text-white text-sm font-medium">
                    {track.name}
                  </div>
                  <div className="text-[#b3b3b3] text-xs">{track.artist}</div>
                </div>
                <div className="text-[#b3b3b3] text-sm truncate">
                  {track.album}
                </div>
                <div className="text-[#b3b3b3] text-sm text-right">
                  {formatDuration(track.duration)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#b3b3b3]">No tracks in this playlist</p>
          </div>
        )}
      </div>
    </div>
  );
};
