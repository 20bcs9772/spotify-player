import useStore from "../../store/useStore";
import {
  extractAllTracks,
  shuffleTracks,
  interleaveTracks,
  sortByReleaseDate,
  sortByPopularity,
  sortAlphabetically,
} from "../../utils/algorithms";
import {
  Shuffle,
  ArrowUpDown,
  Calendar,
  TrendingUp,
  AlignLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { cn } from "../../lib/utils";

export const AlgorithmsSection = ({ stagingPool, isExpanded, onToggle }) => {
  const setQueue = useStore((state) => state.setQueue);
  const playTrack = useStore((state) => state.playTrack);

  const allTracks = extractAllTracks(stagingPool);

  const executeAlgorithm = (algorithmFn, algorithmName) => {
    if (stagingPool.length === 0) {
      return;
    }

    const result = algorithmFn();
    setQueue(result);

    if (result.length > 0) {
      playTrack(result[0], 0);
    }
  };

  const algorithms = [
    {
      id: "shuffle",
      name: "Shuffle",
      icon: <Shuffle className="w-5 h-5" />,
      action: () => executeAlgorithm(() => shuffleTracks(allTracks), "Shuffle"),
    },
    {
      id: "interleave",
      name: "Interleave",
      icon: <ArrowUpDown className="w-5 h-5" />,
      action: () =>
        executeAlgorithm(() => interleaveTracks(stagingPool), "Interleave"),
      disabled: stagingPool.length < 2,
    },
    {
      id: "date",
      name: "By Date",
      icon: <Calendar className="w-5 h-5" />,
      action: () =>
        executeAlgorithm(
          () => sortByReleaseDate(allTracks, false),
          "Sort by Date",
        ),
    },
    {
      id: "popularity",
      name: "By Popularity",
      icon: <TrendingUp className="w-5 h-5" />,
      action: () =>
        executeAlgorithm(
          () => sortByPopularity(allTracks, false),
          "Sort by Popularity",
        ),
    },
    {
      id: "alphabetical",
      name: "A-Z",
      icon: <AlignLeft className="w-5 h-5" />,
      action: () =>
        executeAlgorithm(
          () => sortAlphabetically(allTracks, true),
          "Sort Alphabetically",
        ),
    },
  ];

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="p-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h3 className="text-sm font-semibold text-white">ALGORITHMS</h3>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#b3b3b3]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#b3b3b3]" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {algorithms.map((algo) => (
              <button
                key={algo.id}
                onClick={!algo.disabled ? algo.action : undefined}
                disabled={algo.disabled}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 bg-[#181818] hover:bg-[#282828] rounded-md transition-colors",
                  algo.disabled &&
                    "opacity-50 cursor-not-allowed hover:bg-[#181818]",
                )}
              >
                <div className="text-[#1DB954]">{algo.icon}</div>
                <span className="text-xs font-medium text-white text-center">
                  {algo.name}
                </span>
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
