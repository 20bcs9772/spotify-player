import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  X,
  Music2,
  GripVertical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Droppable } from "../DragAndDrop/Droppable";
import { Draggable } from "../DragAndDrop/Draggable";
import { cn } from "../../lib/utils";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export const StagingPoolSection = ({
  stagingPool,
  isExpanded,
  onToggle,
  onRemove,
}) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="p-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">STAGING POOL</h3>
            <span className="text-xs text-[#b3b3b3]">
              ({stagingPool.length})
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#b3b3b3]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#b3b3b3]" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          {stagingPool.length === 0 ? (
            <div className="text-center py-8 mt-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#232323] flex items-center justify-center">
                <Music2 className="w-8 h-8 text-[#b3b3b3]" />
              </div>
              <p className="text-sm text-[#b3b3b3] mb-1">Empty pool</p>
              <p className="text-xs text-[#6a6a6a]">
                Drag items here or click + to add
              </p>
            </div>
          ) : (
            <Droppable id="staging-pool" className="space-y-2 mt-4">
              {stagingPool.map((item, index) => (
                <Draggable key={item.id} id={item.id} index={index}>
                  <Card className="p-3 bg-[#181818] border-none hover:bg-[#282828] transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4 text-[#b3b3b3] flex-shrink-0" />
                      </div>
                      <img
                        src={item.images?.[0]?.url || ""}
                        alt={item.name}
                        className={cn(
                          "w-10 h-10 object-cover flex-shrink-0",
                          item.type === "artist"
                            ? "rounded-full"
                            : "rounded-md",
                        )}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-[#b3b3b3] truncate">
                          {item.type === "album" && (item.artists?.[0]?.name)}
                          {item.type === "artist" && "Artist"}
                          {item.type === "playlist" && `By ${item.owner?.display_name || "Unknown"}`}
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          onRemove(item.id);
                        }}
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 h-8 w-8 text-[#b3b3b3] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </Draggable>
              ))}
            </Droppable>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
