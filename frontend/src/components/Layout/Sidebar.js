import React from 'react';
import { Home, Search, Library, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import useStore from '../../store/useStore';

export const Sidebar = () => {
  const user = useStore(state => state.user);
  const stagingPool = useStore(state => state.stagingPool);

  return (
    <div className="w-64 bg-surface flex flex-col h-full border-r border-border">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <span className="font-bold text-lg">Spotify Combiner</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavItem icon={<Home size={24} />} label="Home" active />
        <NavItem icon={<Search size={24} />} label="Search" />
        <NavItem icon={<Library size={24} />} label="Your Library" />
        
        <div className="pt-6 pb-2">
          <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Staging Pool
          </div>
        </div>
        
        {stagingPool.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <Plus className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              Add albums, artists, or playlists to get started
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {stagingPool.map((item, index) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer group"
              >
                <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {index + 1}
                </div>
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {item.type === 'album' && item.artist}
                    {item.type === 'artist' && `${item.topTracks?.length || 0} tracks`}
                    {item.type === 'playlist' && `by ${item.owner}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer">
            <img 
              src={user.image} 
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button
    className={cn(
      "flex items-center gap-4 px-3 py-2 rounded-lg w-full transition-colors",
      active 
        ? "bg-surface-elevated text-foreground" 
        : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/50"
    )}
  >
    {icon}
    <span className="font-semibold text-sm">{label}</span>
  </button>
);