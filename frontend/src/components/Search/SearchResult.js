import React from 'react';
import { Plus, Check, Disc, User, ListMusic, Music } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import useStore from '../../store/useStore';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export const SearchResult = ({ item }) => {
  const addToStagingPool = useStore(state => state.addToStagingPool);
  const stagingPool = useStore(state => state.stagingPool);
  
  const isAdded = stagingPool.some(poolItem => poolItem.id === item.id);

  const handleAdd = () => {
    if (!isAdded) {
      addToStagingPool(item);
      toast.success(`Added ${item.name} to staging pool`);
    }
  };

  const getIcon = () => {
    switch (item.type) {
      case 'album':
        return <Disc className="w-4 h-4" />;
      case 'artist':
        return <User className="w-4 h-4" />;
      case 'playlist':
        return <ListMusic className="w-4 h-4" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  const getSubtitle = () => {
    switch (item.type) {
      case 'album':
        return `${item.artist} • ${item.year}`;
      case 'artist':
        return item.genres?.join(', ') || 'Artist';
      case 'playlist':
        return `by ${item.owner}`;
      default:
        return '';
    }
  };

  const getTrackCount = () => {
    if (item.type === 'album' || item.type === 'playlist') {
      return item.tracks?.length || 0;
    } else if (item.type === 'artist') {
      return item.topTracks?.length || 0;
    }
    return 0;
  };

  return (
    <Card className={cn(
      "p-4 hover:bg-surface-elevated transition-all duration-200 cursor-pointer group border-border",
      isAdded && "bg-surface-elevated border-primary/30"
    )}>
      <div className="flex items-center gap-4">
        {/* Image */}
        <div className="relative flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 rounded object-cover"
          />
          {isAdded && (
            <div className="absolute inset-0 bg-primary/20 rounded flex items-center justify-center">
              <Check className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-muted-foreground">{getIcon()}</div>
            <h3 className="font-semibold truncate">{item.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {getSubtitle()}
          </p>
          <p className="text-xs text-subdued mt-1">
            {getTrackCount()} {getTrackCount() === 1 ? 'track' : 'tracks'}
          </p>
        </div>

        {/* Add button */}
        <Button
          onClick={handleAdd}
          disabled={isAdded}
          size="icon"
          variant={isAdded ? "ghost" : "default"}
          className={cn(
            "flex-shrink-0 transition-all",
            isAdded 
              ? "text-primary cursor-default" 
              : "bg-primary hover:bg-primary-hover group-hover:scale-110"
          )}
        >
          {isAdded ? (
            <Check className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </Button>
      </div>
    </Card>
  );
};