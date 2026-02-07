import useStore from "../../store/useStore";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  ListMusic,
} from "lucide-react";
import { Droppable } from "../DragAndDrop/Droppable";
import { Draggable } from "../DragAndDrop/Draggable";
import { formatDuration } from "../../utils/algorithms";

export const QueueSection = ({ queue, isExpanded, onToggle }) => {
  const playTrack = useStore((state) => state.playTrack);

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="p-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">QUEUE</h3>
            <span className="text-xs text-[#b3b3b3]">({queue.length})</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#b3b3b3]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#b3b3b3]" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          {queue.length === 0 ? (
            <div className="text-center py-8 mt-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#232323] flex items-center justify-center">
                <ListMusic className="w-8 h-8 text-[#b3b3b3]" />
              </div>
              <p className="text-sm text-[#b3b3b3] mb-1">No queue</p>
              <p className="text-xs text-[#6a6a6a]">
                Apply an algorithm to generate
              </p>
            </div>
          ) : (
            <Droppable
              id="queue-list"
              className="space-y-1 mt-4 max-h-96 overflow-y-auto"
            >
              {queue.map((track, index) => (
                <Draggable
                  key={`${track.id}-${index}`}
                  id={`${track.id}-${index}`}
                  index={index}
                >
                  <div
                    onClick={() => playTrack(track, index)}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition-colors"
                  >
                    <div className="cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-3 h-3 text-[#b3b3b3] flex-shrink-0" />
                    </div>
                    <span className="text-xs text-[#b3b3b3] w-4">
                      {index + 1}
                    </span>
                    <img
                      src={track.albumArt}
                      alt={track.album}
                      className="w-8 h-8 rounded-sm flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">
                        {track.name}
                      </div>
                      <div className="text-xs text-[#b3b3b3] truncate">
                        {track.artist}
                      </div>
                    </div>
                    <span className="text-xs text-[#b3b3b3]">
                      {formatDuration(track.duration)}
                    </span>
                  </div>
                </Draggable>
              ))}
            </Droppable>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
