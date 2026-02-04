import React from 'react';
import { Home, Search, Library, Plus, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import useStore from '../../store/useStore';

export const LeftSidebar = () => {
  const stagingPool = useStore(state => state.stagingPool);

  return (
    <div className="w-[280px] lg:w-[350px] bg-spotify-dark rounded-lg flex flex-col h-full overflow-hidden">
      {/* Top Navigation */}
      <div className="p-4 space-y-2">
        <NavItem icon={<Home size={24} />} label="Home" active />
        <NavItem icon={<Search size={24} />} label="Search" />
      </div>

      {/* Library Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-2 flex items-center justify-between">
          <button className="flex items-center gap-3 text-[#b3b3b3] hover:text-white transition-colors">
            <Library size={24} />
            <span className="font-bold text-base">Your Library</span>
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors">
            <Plus size={24} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto">
          <FilterPill label="Staging Pool" active />
          <FilterPill label="Albums" />
          <FilterPill label="Artists" />
        </div>

        {/* Library Items - Staging Pool */}
        <div className="flex-1 overflow-y-auto px-2">
          {stagingPool.length === 0 ? (
            <div className="p-4 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#232323] flex items-center justify-center">
                <Library className="w-8 h-8 text-[#b3b3b3]" />
              </div>
              <p className="text-sm text-[#b3b3b3] mb-1">Your staging pool is empty</p>
              <p className="text-xs text-[#6a6a6a]">Add albums, artists, or playlists to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {stagingPool.map((item) => (
                <LibraryItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button
    className={cn(
      "flex items-center gap-4 px-3 py-2 w-full transition-colors rounded-md",
      active 
        ? "text-white" 
        : "text-[#b3b3b3] hover:text-white"
    )}
  >
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </button>
);

const FilterPill = ({ label, active = false }) => (
  <button
    className={cn(
      "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
      active
        ? "bg-white text-black"
        : "bg-[#232323] text-white hover:bg-[#2a2a2a]"
    )}
  >
    {label}
  </button>
);

const LibraryItem = ({ item }) => {
  const getSubtitle = () => {
    switch (item.type) {
      case 'album':
        return `Album • ${item.artist}`;
      case 'artist':
        return 'Artist';
      case 'playlist':
        return `Playlist • ${item.owner}`;
      default:
        return '';
    }
  };

  return (
    <div className="spotify-sidebar-item group">
      <img
        src={item.image}
        alt={item.name}
        className={cn(
          "w-12 h-12 object-cover flex-shrink-0",
          item.type === 'artist' ? 'rounded-full' : 'rounded-md'
        )}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate group-hover:underline">
          {item.name}
        </div>
        <div className="text-xs text-[#b3b3b3] truncate">
          {getSubtitle()}
        </div>
      </div>
    </div>
  );
};