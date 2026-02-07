import React, { useState } from "react";
import { Plus, Play } from "lucide-react";
import { DndContext } from "@dnd-kit/core";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import useStore from "../../store/useStore";
import { extractAllTracks } from "../../utils/algorithms";
import { toast } from "sonner";
import { StagingPoolSection } from "../Sections/StagingPool";
import { AlgorithmsSection } from "../Sections/Algorithms";
import { FiltersSection } from "../Sections/Filters";
import { QueueSection } from "../Sections/Queue";

export const RightPanel = () => {
  const [expandedSections, setExpandedSections] = useState({
    staging: true,
    algorithms: false,
    filters: false,
    queue: false,
  });

  const stagingPool = useStore((state) => state.stagingPool);
  const queue = useStore((state) => state.queue);
  const removeFromStagingPool = useStore(
    (state) => state.removeFromStagingPool,
  );
  const reorderStagingPool = useStore((state) => state.reorderStagingPool);
  const clearStagingPool = useStore((state) => state.clearStagingPool);
  const setQueue = useStore((state) => state.setQueue);
  const reorderQueue = useStore((state) => state.reorderQueue);
  const playTrack = useStore((state) => state.playTrack);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Drag from search to staging pool
    if (
      source.droppableId === "search-results" &&
      destination.droppableId === "staging-pool"
    ) {
      // This is handled in MainView
      return;
    }

    // Reorder staging pool
    if (
      source.droppableId === "staging-pool" &&
      destination.droppableId === "staging-pool"
    ) {
      const items = Array.from(stagingPool);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      reorderStagingPool(items);
    }

    // Reorder queue
    if (
      source.droppableId === "queue-list" &&
      destination.droppableId === "queue-list"
    ) {
      const items = Array.from(queue);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      reorderQueue(items);
    }
  };

  const allTracks = extractAllTracks(stagingPool);
  const totalTracks = allTracks.length;

  return (
    <div className="hidden xl:flex w-[420px] bg-spotify-dark rounded-lg flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-spotify">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-white text-xl">Combiner</h2>
          {stagingPool.length > 0 && (
            <Button
              onClick={clearStagingPool}
              variant="ghost"
              size="sm"
              className="text-[#b3b3b3] hover:text-white h-8 px-2"
            >
              Clear All
            </Button>
          )}
        </div>
        <p className="text-xs text-[#b3b3b3]">
          {stagingPool.length} sources \u2022 {totalTracks} tracks
        </p>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <ScrollArea className="flex-1">
          {/* Staging Pool */}
          <StagingPoolSection
            stagingPool={stagingPool}
            isExpanded={expandedSections.staging}
            onToggle={() => toggleSection("staging")}
            onRemove={removeFromStagingPool}
          />

          <Separator className="bg-[#282828]" />

          {/* Algorithms */}
          <AlgorithmsSection
            stagingPool={stagingPool}
            isExpanded={expandedSections.algorithms}
            onToggle={() => toggleSection("algorithms")}
          />

          <Separator className="bg-[#282828]" />

          {/* Filters */}
          <FiltersSection
            allTracks={allTracks}
            isExpanded={expandedSections.filters}
            onToggle={() => toggleSection("filters")}
          />

          <Separator className="bg-[#282828]" />

          {/* Queue */}
          <QueueSection
            queue={queue}
            isExpanded={expandedSections.queue}
            onToggle={() => toggleSection("queue")}
          />
        </ScrollArea>
      </DndContext>

      {/* Bottom Action Buttons - Sticky */}
      <div className=" bottom-0 left-0 right-0 p-4 bg-spotify-dark border-t border-spotify">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              if (stagingPool.length === 0) {
                toast.error("Add items to staging pool first");
                return;
              }
              const tracks = extractAllTracks(stagingPool);
              setQueue(tracks);
              toast.success(`Queue created with ${tracks.length} tracks`);
            }}
            disabled={stagingPool.length === 0}
            className="h-12 bg-white hover:bg-gray-200 text-black font-bold rounded-full disabled:opacity-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create
          </Button>
          <Button
            onClick={() => {
              if (queue.length === 0) {
                toast.error("No queue to play");
                return;
              }
              playTrack(queue[0], 0);
              toast.success("Playing queue");
            }}
            disabled={queue.length === 0}
            className="h-12 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full disabled:opacity-50"
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            Play
          </Button>
        </div>
      </div>
    </div>
  );
};
