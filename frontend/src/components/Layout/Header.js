import React from 'react';
import { Search, Menu } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-surface-elevated border-b border-border p-4">
      <div className="flex items-center gap-4 max-w-7xl mx-auto">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search albums, artists, playlists..."
              className="pl-10 bg-surface border-border focus:border-primary h-11"
            />
          </div>
        </div>
      </div>
    </header>
  );
};