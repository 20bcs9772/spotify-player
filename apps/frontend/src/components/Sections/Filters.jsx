import React, { useState } from "react";
import useStore from "../../store/useStore";
import { applyFilters, getUniqueGenres } from "../../utils/algorithms";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Filter, ChevronDown, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

export const FiltersSection = ({ allTracks, isExpanded, onToggle }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minYear, setMinYear] = useState([1950]);
  const [maxYear, setMaxYear] = useState([new Date().getFullYear()]);
  const [excludeExplicit, setExcludeExplicit] = useState(false);
  const [minPopularity, setMinPopularity] = useState([0]);

  const setQueue = useStore((state) => state.setQueue);
  const playTrack = useStore((state) => state.playTrack);
  const setFilterOptions = useStore((state) => state.setFilterOptions);

  const availableGenres = getUniqueGenres(allTracks);

  const handleApplyFilters = () => {
    const filters = {
      genres: selectedGenres,
      minYear: minYear[0],
      maxYear: maxYear[0],
      excludeExplicit,
      minPopularity: minPopularity[0],
    };

    setFilterOptions(filters);
    const filtered = applyFilters(allTracks, filters);

    if (filtered.length > 0) {
      setQueue(filtered);
      playTrack(filtered[0], 0);
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="p-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full group">
          <h3 className="text-sm font-semibold text-white">FILTERS</h3>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#b3b3b3]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#b3b3b3]" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-10 bg-[#181818] border-[#282828] hover:bg-[#282828] text-white"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Configure Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#181818] border-[#282828] text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Advanced Filters
                  </DialogTitle>
                  <DialogDescription className="text-[#b3b3b3]">
                    Filter your queue based on genres, years, and more
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="space-y-6 py-4">
                    {/* Genres */}
                    {availableGenres.length > 0 && (
                      <div>
                        <Label className="mb-3 block text-white font-semibold">
                          Genres
                        </Label>
                        <div className="space-y-3 max-h-48 overflow-y-auto bg-[#121212] rounded-lg p-3">
                          {availableGenres.map((genre) => (
                            <div
                              key={genre}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={genre}
                                checked={selectedGenres.includes(genre)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedGenres([
                                      ...selectedGenres,
                                      genre,
                                    ]);
                                  } else {
                                    setSelectedGenres(
                                      selectedGenres.filter((g) => g !== genre),
                                    );
                                  }
                                }}
                                className="border-[#b3b3b3]"
                              />
                              <label
                                htmlFor={genre}
                                className="text-sm font-medium text-white cursor-pointer flex-1"
                              >
                                {genre}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Year Range */}
                    <div>
                      <Label className="mb-3 block text-white font-semibold">
                        Year Range
                      </Label>
                      <div className="space-y-4 bg-[#121212] rounded-lg p-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-[#b3b3b3]">From</span>
                            <span className="text-sm font-bold text-[#1DB954]">
                              {minYear[0]}
                            </span>
                          </div>
                          <Slider
                            value={minYear}
                            onValueChange={setMinYear}
                            min={1950}
                            max={new Date().getFullYear()}
                            step={1}
                            className="cursor-pointer"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-[#b3b3b3]">To</span>
                            <span className="text-sm font-bold text-[#1DB954]">
                              {maxYear[0]}
                            </span>
                          </div>
                          <Slider
                            value={maxYear}
                            onValueChange={setMaxYear}
                            min={1950}
                            max={new Date().getFullYear()}
                            step={1}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Popularity */}
                    <div>
                      <Label className="mb-3 block text-white font-semibold">
                        Minimum Popularity
                      </Label>
                      <div className="bg-[#121212] rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-[#b3b3b3]">
                            Threshold
                          </span>
                          <span className="text-sm font-bold text-[#1DB954]">
                            {minPopularity[0]}%
                          </span>
                        </div>
                        <Slider
                          value={minPopularity}
                          onValueChange={setMinPopularity}
                          min={0}
                          max={100}
                          step={5}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Explicit Content */}
                    <div className="bg-[#121212] rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="explicit"
                          checked={excludeExplicit}
                          onCheckedChange={setExcludeExplicit}
                          className="border-[#b3b3b3]"
                        />
                        <label
                          htmlFor="explicit"
                          className="text-sm font-medium text-white cursor-pointer"
                        >
                          Exclude explicit content
                        </label>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <Button
                  onClick={handleApplyFilters}
                  className="w-full h-12 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold"
                >
                  Apply Filters
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
