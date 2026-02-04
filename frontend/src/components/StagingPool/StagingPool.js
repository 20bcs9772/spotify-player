import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Trash2, Play } from 'lucide-react';
import useStore from '../../store/useStore';
import { PoolItem } from './PoolItem';
import { extractAllTracks } from '../../utils/algorithms';
import { toast } from 'sonner';

export const StagingPool = () => {
  const stagingPool = useStore(state => state.stagingPool);
  const reorderStagingPool = useStore(state => state.reorderStagingPool);
  const clearStagingPool = useStore(state => state.clearStagingPool);
  const setQueue = useStore(state => state.setQueue);
  const playTrack = useStore(state => state.playTrack);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = stagingPool.findIndex(item => item.id === active.id);
      const newIndex = stagingPool.findIndex(item => item.id === over.id);
      const newOrder = arrayMove(stagingPool, oldIndex, newIndex);
      reorderStagingPool(newOrder);
      toast.success('Order updated');
    }
  };

  const handleClear = () => {
    clearStagingPool();
    toast.success('Staging pool cleared');
  };

  const handlePlayAll = () => {
    const tracks = extractAllTracks(stagingPool);
    if (tracks.length === 0) {
      toast.error('No tracks to play');
      return;
    }
    setQueue(tracks);
    playTrack(tracks[0], 0);
    toast.success(`Playing ${tracks.length} tracks`);
  };

  const totalTracks = stagingPool.reduce((acc, item) => {
    if (item.type === 'album' || item.type === 'playlist') {
      return acc + (item.tracks?.length || 0);
    } else if (item.type === 'artist') {
      return acc + (item.topTracks?.length || 0);
    }
    return acc;
  }, 0);

  return (
    <div className="h-full flex flex-col bg-surface rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Staging Pool</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {stagingPool.length} {stagingPool.length === 1 ? 'source' : 'sources'} • {totalTracks} {totalTracks === 1 ? 'track' : 'tracks'}
            </p>
          </div>
          {stagingPool.length > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={handlePlayAll}
                size="sm"
                className="bg-primary hover:bg-primary-hover"
              >
                <Play className="w-4 h-4 mr-2" />
                Play All
              </Button>
              <Button
                onClick={handleClear}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Pool items */}
      {stagingPool.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-surface-elevated flex items-center justify-center">
              <Play className="w-12 h-12 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Your staging pool is empty</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Search and add albums, artists, or playlists to create your custom mix
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-6 pt-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={stagingPool.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {stagingPool.map((item, index) => (
                    <PoolItem key={item.id} item={item} index={index} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};