import React, { useState } from 'react';
import {
  Shuffle,
  ArrowUpDown,
  Calendar,
  TrendingUp,
  AlignLeft,
  Filter,
  Wand2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import useStore from '../../store/useStore';
import {
  extractAllTracks,
  shuffleTracks,
  interleaveTracks,
  sortByReleaseDate,
  sortByPopularity,
  sortAlphabetically,
  applyFilters,
  getUniqueGenres,
} from '../../utils/algorithms';
import { toast } from 'sonner';

export const ControlPanel = () => {
  const stagingPool = useStore(state => state.stagingPool);
  const setQueue = useStore(state => state.setQueue);
  const playTrack = useStore(state => state.playTrack);
  const filterOptions = useStore(state => state.filterOptions);
  const setFilterOptions = useStore(state => state.setFilterOptions);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minYear, setMinYear] = useState([1950]);
  const [maxYear, setMaxYear] = useState([new Date().getFullYear()]);
  const [excludeExplicit, setExcludeExplicit] = useState(false);
  const [minPopularity, setMinPopularity] = useState([0]);

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

  const handleShuffle = () => {
    executeAlgorithm(
      () => shuffleTracks(allTracks),
      'Shuffle'
    );
  };

  const handleInterleave = () => {
    if (stagingPool.length < 2) {
      toast.error('Add at least 2 items to staging pool to interleave');
      return;
    }
    executeAlgorithm(
      () => interleaveTracks(stagingPool),
      'Interleave'
    );
  };

  const handleSortByDate = () => {
    executeAlgorithm(
      () => sortByReleaseDate(allTracks, false),
      'Sort by Release Date'
    );
  };

  const handleSortByPopularity = () => {
    executeAlgorithm(
      () => sortByPopularity(allTracks, false),
      'Sort by Popularity'
    );
  };

  const handleSortAlphabetically = () => {
    executeAlgorithm(
      () => sortAlphabetically(allTracks, true),
      'Sort Alphabetically'
    );
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

  const algorithms = [
    {
      id: 'shuffle',
      name: 'Shuffle',
      description: 'Randomize all tracks',
      icon: <Shuffle className="w-5 h-5" />,
      action: handleShuffle,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'interleave',
      name: 'Interleave',
      description: 'Alternate tracks between sources',
      icon: <ArrowUpDown className="w-5 h-5" />,
      action: handleInterleave,
      color: 'from-blue-500 to-cyan-500',
      disabled: stagingPool.length < 2
    },
    {
      id: 'date',
      name: 'By Release Date',
      description: 'Newest to oldest',
      icon: <Calendar className="w-5 h-5" />,
      action: handleSortByDate,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'popularity',
      name: 'By Popularity',
      description: 'Most to least popular',
      icon: <TrendingUp className="w-5 h-5" />,
      action: handleSortByPopularity,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'alphabetical',
      name: 'Alphabetically',
      description: 'A to Z by track name',
      icon: <AlignLeft className="w-5 h-5" />,
      action: handleSortAlphabetically,
      color: 'from-indigo-500 to-purple-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Control Panel</h2>
        <p className="text-muted-foreground">
          Apply algorithms to create your perfect queue
        </p>
      </div>

      {/* Algorithms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {algorithms.map((algo) => (
          <Card
            key={algo.id}
            className="p-4 border-border hover:border-primary/30 transition-all duration-200 cursor-pointer group"
            onClick={!algo.disabled ? algo.action : undefined}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${algo.color} text-white flex-shrink-0`}>
                {algo.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {algo.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {algo.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6 border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Advanced Filters</h3>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Wand2 className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
                <DialogDescription>
                  Filter your queue based on genres, years, and more
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Genres */}
                {availableGenres.length > 0 && (
                  <div>
                    <Label className="mb-3 block">Genres</Label>
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
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
                  <Label className="mb-3 block">Year Range</Label>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">From</span>
                        <span className="text-sm font-medium">{minYear[0]}</span>
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
                        <span className="text-sm text-muted-foreground">To</span>
                        <span className="text-sm font-medium">{maxYear[0]}</span>
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
                  <Label className="mb-3 block">Minimum Popularity</Label>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Threshold</span>
                    <span className="text-sm font-medium">{minPopularity[0]}</span>
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
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Exclude explicit content
                  </label>
                </div>
              </div>
              <Button onClick={handleApplyFilters} className="w-full bg-primary hover:bg-primary-hover">
                Apply Filters
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-muted-foreground">
          Click configure to filter tracks by genre, year, popularity, and content rating
        </p>
      </Card>
    </div>
  );
};