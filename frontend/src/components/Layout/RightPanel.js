import React, { useState } from 'react';
import { 
  Play, 
  X, 
  Shuffle, 
  ArrowUpDown, 
  Calendar, 
  TrendingUp, 
  AlignLeft,
  Filter,
  Plus,
  Music2,
  GripVertical
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import useStore from '../../store/useStore';
import { formatDuration, extractAllTracks } from '../../utils/algorithms';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export const RightPanel = () => {
  const stagingPool = useStore(state => state.stagingPool);
  const removeFromStagingPool = useStore(state => state.removeFromStagingPool);
  const clearStagingPool = useStore(state => state.clearStagingPool);
  const setQueue = useStore(state => state.setQueue);
  const playTrack = useStore(state => state.playTrack);
  const filterOptions = useStore(state => state.filterOptions);
  const setFilterOptions = useStore(state => state.setFilterOptions);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minYear, setMinYear] = useState([1950]);
  const [maxYear, setMaxYear] = useState([new Date().getFullYear()]);
  const [excludeExplicit, setExcludeExplicit] = useState(false);
  const [minPopularity, setMinPopularity] = useState([0]);

  const {
    shuffleTracks,
    interleaveTracks,
    sortByReleaseDate,
    sortByPopularity,
    sortAlphabetically,
    applyFilters,
    getUniqueGenres
  } = require('../../utils/algorithms');

  const allTracks = extractAllTracks(stagingPool);
  const availableGenres = getUniqueGenres(allTracks);

  const executeAlgorithm = (algorithmFn, algorithmName) => {
    if (stagingPool.length === 0) {
      toast.error('Add items to staging pool first');
      return;
    }

    const result = algorithmFn();
    setQueue(result);
    
    if (result.length > 0) {
      playTrack(result[0], 0);
      toast.success(`${algorithmName} applied! ${result.length} tracks in queue`);
    } else {
      toast.error('No tracks match the criteria');
    }
  };

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
      toast.success(`Filters applied! ${filtered.length} tracks in queue`);
    } else {
      toast.error('No tracks match the filter criteria');
    }
  };

  const handleCreatePlaylist = () => {
    if (stagingPool.length === 0) {
      toast.error('Add items to staging pool first');
      return;
    }
    const tracks = extractAllTracks(stagingPool);
    setQueue(tracks);
    playTrack(tracks[0], 0);
    toast.success(`Created playlist with ${tracks.length} tracks`);
  };

  const algorithms = [
    {
      id: 'shuffle',
      name: 'Shuffle',
      icon: <Shuffle className="w-5 h-5" />,
      action: () => executeAlgorithm(() => shuffleTracks(allTracks), 'Shuffle'),
    },
    {
      id: 'interleave',
      name: 'Interleave',
      icon: <ArrowUpDown className="w-5 h-5" />,
      action: () => executeAlgorithm(() => interleaveTracks(stagingPool), 'Interleave'),
      disabled: stagingPool.length < 2
    },
    {
      id: 'date',
      name: 'By Date',
      icon: <Calendar className="w-5 h-5" />,
      action: () => executeAlgorithm(() => sortByReleaseDate(allTracks, false), 'Sort by Date'),
    },
    {
      id: 'popularity',
      name: 'By Popularity',
      icon: <TrendingUp className="w-5 h-5" />,
      action: () => executeAlgorithm(() => sortByPopularity(allTracks, false), 'Sort by Popularity'),
    },
    {
      id: 'alphabetical',
      name: 'A-Z',
      icon: <AlignLeft className="w-5 h-5" />,
      action: () => executeAlgorithm(() => sortAlphabetically(allTracks, true), 'Sort Alphabetically'),
    }
  ];

  const totalTracks = allTracks.length;

  return (
    <div className="hidden xl:flex w-[380px] bg-spotify-dark rounded-lg flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-spotify">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-white text-lg">Combiner</h2>
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
          {stagingPool.length} sources • {totalTracks} tracks
        </p>
      </div>

      <ScrollArea className="flex-1">
        {/* Staging Pool */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">STAGING POOL</h3>
          
          {stagingPool.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#232323] flex items-center justify-center">
                <Music2 className="w-8 h-8 text-[#b3b3b3]" />
              </div>
              <p className="text-sm text-[#b3b3b3] mb-1">Empty pool</p>
              <p className="text-xs text-[#6a6a6a]">Search and add content</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stagingPool.map((item) => (
                <Card key={item.id} className="p-3 bg-[#181818] border-none hover:bg-[#282828] transition-colors">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-[#b3b3b3] flex-shrink-0" />
                    <img
                      src={item.image}
                      alt={item.name}
                      className={cn(
                        "w-10 h-10 object-cover flex-shrink-0",
                        item.type === 'artist' ? 'rounded-full' : 'rounded-md'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{item.name}</div>
                      <div className="text-xs text-[#b3b3b3] truncate">
                        {item.type === 'album' && item.artist}
                        {item.type === 'artist' && 'Artist'}
                        {item.type === 'playlist' && `By ${item.owner}`}
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        removeFromStagingPool(item.id);
                        toast.success(`Removed ${item.name}`);
                      }}
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 h-8 w-8 text-[#b3b3b3] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-[#282828]" />

        {/* Algorithms */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">ALGORITHMS</h3>
          <div className="grid grid-cols-2 gap-2">
            {algorithms.map((algo) => (
              <button
                key={algo.id}
                onClick={!algo.disabled ? algo.action : undefined}
                disabled={algo.disabled}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 bg-[#181818] hover:bg-[#282828] rounded-md transition-colors",
                  algo.disabled && "opacity-50 cursor-not-allowed hover:bg-[#181818]"
                )}
              >
                <div className="text-[#1DB954]">{algo.icon}</div>
                <span className="text-xs font-medium text-white">{algo.name}</span>
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-[#282828]" />

        {/* Filters */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">FILTERS</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-[#b3b3b3] hover:text-white">
                  <Filter className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#121212] border-[#282828] text-white">
                <DialogHeader>
                  <DialogTitle>Advanced Filters</DialogTitle>
                  <DialogDescription className="text-[#b3b3b3]">
                    Filter your queue based on genres, years, and more
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Genres */}
                  {availableGenres.length > 0 && (
                    <div>
                      <Label className="mb-3 block text-white">Genres</Label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableGenres.map((genre) => (
                          <div key={genre} className="flex items-center space-x-2">
                            <Checkbox
                              id={genre}
                              checked={selectedGenres.includes(genre)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedGenres([...selectedGenres, genre]);
                                } else {
                                  setSelectedGenres(selectedGenres.filter(g => g !== genre));
                                }
                              }}
                            />
                            <label
                              htmlFor={genre}
                              className="text-sm font-medium text-white cursor-pointer"
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
                    <Label className="mb-3 block text-white">Year Range</Label>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-[#b3b3b3]">From</span>
                          <span className="text-sm font-medium text-white">{minYear[0]}</span>
                        </div>
                        <Slider
                          value={minYear}
                          onValueChange={setMinYear}
                          min={1950}
                          max={new Date().getFullYear()}
                          step={1}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-[#b3b3b3]">To</span>
                          <span className="text-sm font-medium text-white">{maxYear[0]}</span>
                        </div>
                        <Slider
                          value={maxYear}
                          onValueChange={setMaxYear}
                          min={1950}
                          max={new Date().getFullYear()}
                          step={1}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Popularity */}
                  <div>
                    <Label className="mb-3 block text-white">Minimum Popularity</Label>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#b3b3b3]">Threshold</span>
                      <span className="text-sm font-medium text-white">{minPopularity[0]}</span>
                    </div>
                    <Slider
                      value={minPopularity}
                      onValueChange={setMinPopularity}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  {/* Explicit Content */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="explicit"
                      checked={excludeExplicit}
                      onCheckedChange={setExcludeExplicit}
                    />
                    <label
                      htmlFor="explicit"
                      className="text-sm font-medium text-white cursor-pointer"
                    >
                      Exclude explicit content
                    </label>
                  </div>
                </div>
                <Button 
                  onClick={handleApplyFilters} 
                  className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold"
                >
                  Apply Filters
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs text-[#b3b3b3]">
            Configure genre, year, and popularity filters
          </p>
        </div>

        <Separator className="bg-[#282828]" />

        {/* Create Playlist Button */}
        <div className="p-4">
          <Button
            onClick={handleCreatePlaylist}
            disabled={stagingPool.length === 0}
            className="w-full h-12 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create & Play Queue
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};