import React, { useEffect } from "react";
import {
  Home,
  Search,
  Library,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import useStore from "../../store/useStore";
import { Separator } from "../ui/separator";

export const LeftSidebar = ({ isCollapsed, onToggleCollapse }) => {
  const setSelectedPlaylist = useStore((state) => state.setSelectedPlaylist);
  const selectedPlaylist = useStore((state) => state.selectedPlaylist);
  const getUserPlaylists = useStore((state) => state.getMyPlaylists);
  const userPlaylists = useStore((state) => state.myPlaylists);

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  useEffect(() => {
    getUserPlaylists();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        "bg-spotify-dark rounded-lg flex flex-col h-full overflow-hidden transition-all duration-300",
        isCollapsed ? "w-[72px]" : "w-[280px] lg:w-[350px]",
      )}
    >
      {/* Top Navigation */}
      <div className="py-4 px-5 space-y-2">
        <NavItem
          icon={<Home size={24} />}
          label="Home"
          active={!selectedPlaylist}
          collapsed={isCollapsed}
          onClick={() => setSelectedPlaylist("home")}
        />
        <NavItem
          icon={<Search size={24} />}
          label="Search"
          collapsed={isCollapsed}
          onClick={() => setSelectedPlaylist("search")}
        />
        <Separator className="bg-[#5a5a5a] mt-4" />
      </div>

      {/* Library Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className={`px-4 py-2 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          <button
            className="flex items-center gap-3 text-[#b3b3b3] hover:text-white transition-colors"
            onClick={onToggleCollapse}
          >
            <Library size={24} />
            {!isCollapsed && (
              <span className="font-bold text-base">Your Library</span>
            )}
          </button>
          {!isCollapsed && (
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <Plus size={24} />
            </button>
          )}
        </div>

        {!isCollapsed && (
          <>
            {/* Filter Pills */}
            <div className="px-4 py-3 flex gap-2 overflow-x-auto">
              <FilterPill label="Playlists" active />
              <FilterPill label="Artists" />
              <FilterPill label="Albums" />
            </div>

            {/* Playlists */}
            <div className="flex-1 overflow-y-auto px-2">
              <div className="space-y-1">
                {userPlaylists.map((playlist) => (
                  <PlaylistItem
                    key={playlist.id}
                    playlist={playlist}
                    isActive={selectedPlaylist?.id === playlist.id}
                    onClick={() => handlePlaylistClick(playlist)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {isCollapsed && (
          <div className="flex justify-center overflow-y-auto px-1 py-2">
            <div className="space-y-2">
              {userPlaylists
                .filter((playlist) => playlist.tracks.total > 0)
                .map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handlePlaylistClick(playlist)}
                    className={cn(
                      "w-full p-2 rounded-md transition-colors",
                      selectedPlaylist?.id === playlist.id
                        ? "bg-[#282828]"
                        : "hover:bg-[#232323]",
                    )}
                    title={playlist.name}
                  >
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <div className="p-2 border-t border-spotify">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 text-[#b3b3b3] hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full transition-colors rounded-md",
      collapsed ? "justify-center p-2" : "gap-4 py-2",
      active ? "text-white" : "text-[#b3b3b3] hover:text-white",
    )}
    title={collapsed ? label : undefined}
  >
    {icon}
    {!collapsed && <span className="font-bold text-sm">{label}</span>}
  </button>
);

const FilterPill = ({ label, active = false }) => (
  <button
    className={cn(
      "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
      active
        ? "bg-white text-black"
        : "bg-[#232323] text-white hover:bg-[#2a2a2a]",
    )}
  >
    {label}
  </button>
);

const PlaylistItem = ({ playlist, isActive, onClick }) => {
  if (!playlist.tracks.total) {
    return;
  }
  return (
    <div
      onClick={onClick}
      className={cn("spotify-sidebar-item group", isActive && "bg-[#282828]")}
    >
      <img
        src={playlist?.images[0]?.url}
        alt={playlist.name}
        className="w-12 h-12 object-cover flex-shrink-0 rounded-md"
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate group-hover:underline">
          {playlist.name}
        </div>
        <div className="text-xs text-[#b3b3b3] truncate">
          Playlist • {playlist.owner.display_name}
        </div>
      </div>
    </div>
  );
};
