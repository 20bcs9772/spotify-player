import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Disc, User, ListMusic } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import useStore from '../../store/useStore';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export const PoolItem = ({ item, index }) => {
  const removeFromStagingPool = useStore(state => state.removeFromStagingPool);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemove = () => {
    removeFromStagingPool(item.id);
    toast.success(`Removed ${item.name}`);
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
        return null;
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
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-4 border-border transition-all duration-200",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Index */}
        <div className="text-muted-foreground font-medium w-6 text-center">
          {index + 1}
        </div>

        {/* Image */}
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 rounded object-cover flex-shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-muted-foreground">{getIcon()}</div>
            <h3 className="font-semibold truncate">{item.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {getSubtitle()}
          </p>
          <p className="text-xs text-subdued mt-0.5">
            {getTrackCount()} {getTrackCount() === 1 ? 'track' : 'tracks'}
          </p>
        </div>

        {/* Remove button */}
        <Button
          onClick={handleRemove}
          variant="ghost"
          size="icon"
          className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};