import React, { useState } from 'react';
import { 
  X, 
  Shuffle, 
  ArrowUpDown, 
  Calendar, 
  TrendingUp, 
  AlignLeft,
  Filter,
  Plus,
  Music2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Play,
  ListMusic
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import useStore from '../../store/useStore';
import { formatDuration, extractAllTracks } from '../../utils/algorithms';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export const RightPanel = () => {
  const [expandedSections, setExpandedSections] = useState({
    staging: true,
    algorithms: false,
    filters: false,
    queue: false
  });

  const stagingPool = useStore(state => state.stagingPool);
  const queue = useStore(state => state.queue);
  const removeFromStagingPool = useStore(state => state.removeFromStagingPool);
  const reorderStagingPool = useStore(state => state.reorderStagingPool);
  const clearStagingPool = useStore(state => state.clearStagingPool);
  const setQueue = useStore(state => state.setQueue);
  const reorderQueue = useStore(state => state.reorderQueue);
  const playTrack = useStore(state => state.playTrack);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Drag from search to staging pool
    if (source.droppableId === 'search-results' && destination.droppableId === 'staging-pool') {
      // This is handled in MainView
      return;
    }

    // Reorder staging pool
    if (source.droppableId === 'staging-pool' && destination.droppableId === 'staging-pool') {
      const items = Array.from(stagingPool);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      reorderStagingPool(items);
      toast.success('Pool reordered');
    }

    // Reorder queue
    if (source.droppableId === 'queue-list' && destination.droppableId === 'queue-list') {
      const items = Array.from(queue);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      reorderQueue(items);
      toast.success('Queue reordered');
    }
  };

  const allTracks = extractAllTracks(stagingPool);
  const totalTracks = allTracks.length;

  return (
    <div className=\"hidden xl:flex w-[420px] bg-spotify-dark rounded-lg flex-col h-full overflow-hidden\">
      {/* Header */}
      <div className=\"p-4 border-b border-spotify\">
        <div className=\"flex items-center justify-between mb-2\">
          <h2 className=\"font-bold text-white text-xl\">Combiner</h2>
          {stagingPool.length > 0 && (
            <Button
              onClick={clearStagingPool}
              variant=\"ghost\"
              size=\"sm\"
              className=\"text-[#b3b3b3] hover:text-white h-8 px-2\"
            >
              Clear All
            </Button>
          )}
        </div>
        <p className=\"text-xs text-[#b3b3b3]\">
          {stagingPool.length} sources \u2022 {totalTracks} tracks
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <ScrollArea className=\"flex-1 pb-24\">
          {/* Staging Pool */}
          <StagingPoolSection
            stagingPool={stagingPool}
            isExpanded={expandedSections.staging}
            onToggle={() => toggleSection('staging')}
            onRemove={removeFromStagingPool}
          />

          <Separator className=\"bg-[#282828]\" />

          {/* Algorithms */}
          <AlgorithmsSection
            stagingPool={stagingPool}
            isExpanded={expandedSections.algorithms}
            onToggle={() => toggleSection('algorithms')}
          />

          <Separator className=\"bg-[#282828]\" />

          {/* Filters */}
          <FiltersSection
            allTracks={allTracks}
            isExpanded={expandedSections.filters}
            onToggle={() => toggleSection('filters')}
          />

          <Separator className=\"bg-[#282828]\" />

          {/* Queue */}
          <QueueSection
            queue={queue}
            isExpanded={expandedSections.queue}
            onToggle={() => toggleSection('queue')}
          />
        </ScrollArea>
      </DragDropContext>

      {/* Bottom Action Buttons - Sticky */}
      <div className=\"absolute bottom-0 left-0 right-0 p-4 bg-spotify-dark border-t border-spotify\">
        <div className=\"grid grid-cols-2 gap-2\">
          <Button
            onClick={() => {
              if (stagingPool.length === 0) {
                toast.error('Add items to staging pool first');
                return;
              }
              const tracks = extractAllTracks(stagingPool);
              setQueue(tracks);
              toast.success(`Queue created with ${tracks.length} tracks`);
            }}
            disabled={stagingPool.length === 0}
            className=\"h-12 bg-white hover:bg-gray-200 text-black font-bold rounded-full disabled:opacity-50\"
          >
            <Plus className=\"w-5 h-5 mr-2\" />
            Create
          </Button>
          <Button
            onClick={() => {
              if (queue.length === 0) {
                toast.error('No queue to play');
                return;
              }
              playTrack(queue[0], 0);
              toast.success('Playing queue');
            }}
            disabled={queue.length === 0}
            className=\"h-12 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full disabled:opacity-50\"
          >
            <Play className=\"w-5 h-5 mr-2 fill-current\" />
            Play
          </Button>
        </div>
      </div>
    </div>
  );
};

// Staging Pool Section
const StagingPoolSection = ({ stagingPool, isExpanded, onToggle, onRemove }) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className=\"p-4\">
        <CollapsibleTrigger className=\"flex items-center justify-between w-full group\">
          <div className=\"flex items-center gap-2\">
            <h3 className=\"text-sm font-semibold text-white\">STAGING POOL</h3>
            <span className=\"text-xs text-[#b3b3b3]\">({stagingPool.length})</span>
          </div>
          {isExpanded ? <ChevronDown className=\"w-4 h-4 text-[#b3b3b3]\" /> : <ChevronRight className=\"w-4 h-4 text-[#b3b3b3]\" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          {stagingPool.length === 0 ? (
            <div className=\"text-center py-8 mt-4\">
              <div className=\"w-16 h-16 mx-auto mb-3 rounded-full bg-[#232323] flex items-center justify-center\">
                <Music2 className=\"w-8 h-8 text-[#b3b3b3]\" />
              </div>
              <p className=\"text-sm text-[#b3b3b3] mb-1\">Empty pool</p>
              <p className=\"text-xs text-[#6a6a6a]\">Drag items here or click + to add</p>
            </div>
          ) : (
            <Droppable droppableId=\"staging-pool\">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    \"space-y-2 mt-4\",
                    snapshot.isDraggingOver && \"bg-[#1DB954]/10 rounded-lg p-2\"
                  )}
                >
                  {stagingPool.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            \"p-3 bg-[#181818] border-none hover:bg-[#282828] transition-colors\",
                            snapshot.isDragging && \"opacity-50 shadow-2xl\"
                          )}
                        >
                          <div className=\"flex items-center gap-2\">
                            <div {...provided.dragHandleProps} className=\"cursor-grab active:cursor-grabbing\">
                              <GripVertical className=\"w-4 h-4 text-[#b3b3b3] flex-shrink-0\" />
                            </div>
                            <img
                              src={item.image}
                              alt={item.name}
                              className={cn(
                                \"w-10 h-10 object-cover flex-shrink-0\",
                                item.type === 'artist' ? 'rounded-full' : 'rounded-md'
                              )}
                            />
                            <div className=\"flex-1 min-w-0\">
                              <div className=\"text-sm font-medium text-white truncate\">{item.name}</div>
                              <div className=\"text-xs text-[#b3b3b3] truncate\">
                                {item.type === 'album' && item.artist}
                                {item.type === 'artist' && 'Artist'}
                                {item.type === 'playlist' && `By ${item.owner}`}
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                onRemove(item.id);
                                toast.success(`Removed ${item.name}`);
                              }}
                              variant=\"ghost\"
                              size=\"icon\"
                              className=\"flex-shrink-0 h-8 w-8 text-[#b3b3b3] hover:text-white\"
                            >
                              <X className=\"w-4 h-4\" />
                            </Button>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

// Algorithms Section  
const AlgorithmsSection = ({ stagingPool, isExpanded, onToggle }) => {
  const setQueue = useStore(state => state.setQueue);
  const playTrack = useStore(state => state.playTrack);

  const {
    shuffleTracks,
    interleaveTracks,
    sortByReleaseDate,
    sortByPopularity,
    sortAlphabetically,
    extractAllTracks
  } = require('../../utils/algorithms');

  const allTracks = extractAllTracks(stagingPool);

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

  const algorithms = [
    {
      id: 'shuffle',
      name: 'Shuffle',
      icon: <Shuffle className=\"w-5 h-5\" />,
      action: () => executeAlgorithm(() => shuffleTracks(allTracks), 'Shuffle'),
    },
    {
      id: 'interleave',
      name: 'Interleave',
      icon: <ArrowUpDown className=\"w-5 h-5\" />,
      action: () => executeAlgorithm(() => interleaveTracks(stagingPool), 'Interleave'),
      disabled: stagingPool.length < 2
    },
    {
      id: 'date',
      name: 'By Date',
      icon: <Calendar className=\"w-5 h-5\" />,
      action: () => executeAlgorithm(() => sortByReleaseDate(allTracks, false), 'Sort by Date'),
    },
    {
      id: 'popularity',
      name: 'By Popularity',
      icon: <TrendingUp className=\"w-5 h-5\" />,
      action: () => executeAlgorithm(() => sortByPopularity(allTracks, false), 'Sort by Popularity'),
    },
    {
      id: 'alphabetical',
      name: 'A-Z',
      icon: <AlignLeft className=\"w-5 h-5\" />,
      action: () => executeAlgorithm(() => sortAlphabetically(allTracks, true), 'Sort Alphabetically'),
    }
  ];

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className=\"p-4\">
        <CollapsibleTrigger className=\"flex items-center justify-between w-full group\">
          <h3 className=\"text-sm font-semibold text-white\">ALGORITHMS</h3>
          {isExpanded ? <ChevronDown className=\"w-4 h-4 text-[#b3b3b3]\" /> : <ChevronRight className=\"w-4 h-4 text-[#b3b3b3]\" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className=\"grid grid-cols-2 gap-2 mt-4\">
            {algorithms.map((algo) => (
              <button
                key={algo.id}
                onClick={!algo.disabled ? algo.action : undefined}
                disabled={algo.disabled}
                className={cn(
                  \"flex flex-col items-center gap-2 p-3 bg-[#181818] hover:bg-[#282828] rounded-md transition-colors\",
                  algo.disabled && \"opacity-50 cursor-not-allowed hover:bg-[#181818]\"
                )}
              >
                <div className=\"text-[#1DB954]\">{algo.icon}</div>
                <span className=\"text-xs font-medium text-white text-center\">{algo.name}</span>
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

// Filters Section
const FiltersSection = ({ allTracks, isExpanded, onToggle }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minYear, setMinYear] = useState([1950]);
  const [maxYear, setMaxYear] = useState([new Date().getFullYear()]);
  const [excludeExplicit, setExcludeExplicit] = useState(false);
  const [minPopularity, setMinPopularity] = useState([0]);

  const setQueue = useStore(state => state.setQueue);
  const playTrack = useStore(state => state.playTrack);
  const setFilterOptions = useStore(state => state.setFilterOptions);

  const { applyFilters, getUniqueGenres } = require('../../utils/algorithms');
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
      toast.success(`Filters applied! ${filtered.length} tracks in queue`);
    } else {
      toast.error('No tracks match the filter criteria');
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className=\"p-4\">
        <CollapsibleTrigger className=\"flex items-center justify-between w-full group\">
          <h3 className=\"text-sm font-semibold text-white\">FILTERS</h3>
          {isExpanded ? <ChevronDown className=\"w-4 h-4 text-[#b3b3b3]\" /> : <ChevronRight className=\"w-4 h-4 text-[#b3b3b3]\" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className=\"mt-4\">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant=\"outline\" 
                  className=\"w-full h-10 bg-[#181818] border-[#282828] hover:bg-[#282828] text-white\"
                >
                  <Filter className=\"w-4 h-4 mr-2\" />
                  Configure Filters
                </Button>
              </DialogTrigger>
              <DialogContent className=\"bg-[#181818] border-[#282828] text-white max-w-md\">
                <DialogHeader>
                  <DialogTitle className=\"text-xl font-bold\">Advanced Filters</DialogTitle>
                  <DialogDescription className=\"text-[#b3b3b3]\">
                    Filter your queue based on genres, years, and more
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className=\"max-h-[60vh] pr-4\">
                  <div className=\"space-y-6 py-4\">
                    {/* Genres */}
                    {availableGenres.length > 0 && (
                      <div>
                        <Label className=\"mb-3 block text-white font-semibold\">Genres</Label>
                        <div className=\"space-y-3 max-h-48 overflow-y-auto bg-[#121212] rounded-lg p-3\">
                          {availableGenres.map((genre) => (
                            <div key={genre} className=\"flex items-center space-x-2\">
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
                                className=\"border-[#b3b3b3]\"
                              />
                              <label
                                htmlFor={genre}
                                className=\"text-sm font-medium text-white cursor-pointer flex-1\"
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
                      <Label className=\"mb-3 block text-white font-semibold\">Year Range</Label>
                      <div className=\"space-y-4 bg-[#121212] rounded-lg p-4\">
                        <div>
                          <div className=\"flex justify-between mb-2\">
                            <span className=\"text-sm text-[#b3b3b3]\">From</span>
                            <span className=\"text-sm font-bold text-[#1DB954]\">{minYear[0]}</span>
                          </div>
                          <Slider
                            value={minYear}
                            onValueChange={setMinYear}
                            min={1950}
                            max={new Date().getFullYear()}
                            step={1}
                            className=\"cursor-pointer\"
                          />
                        </div>
                        <div>
                          <div className=\"flex justify-between mb-2\">
                            <span className=\"text-sm text-[#b3b3b3]\">To</span>
                            <span className=\"text-sm font-bold text-[#1DB954]\">{maxYear[0]}</span>
                          </div>
                          <Slider
                            value={maxYear}
                            onValueChange={setMaxYear}
                            min={1950}
                            max={new Date().getFullYear()}
                            step={1}
                            className=\"cursor-pointer\"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Popularity */}
                    <div>
                      <Label className=\"mb-3 block text-white font-semibold\">Minimum Popularity</Label>
                      <div className=\"bg-[#121212] rounded-lg p-4\">
                        <div className=\"flex justify-between mb-2\">
                          <span className=\"text-sm text-[#b3b3b3]\">Threshold</span>
                          <span className=\"text-sm font-bold text-[#1DB954]\">{minPopularity[0]}%</span>
                        </div>
                        <Slider
                          value={minPopularity}
                          onValueChange={setMinPopularity}
                          min={0}
                          max={100}
                          step={5}
                          className=\"cursor-pointer\"
                        />
                      </div>
                    </div>

                    {/* Explicit Content */}
                    <div className=\"bg-[#121212] rounded-lg p-4\">
                      <div className=\"flex items-center space-x-3\">
                        <Checkbox
                          id=\"explicit\"
                          checked={excludeExplicit}
                          onCheckedChange={setExcludeExplicit}
                          className=\"border-[#b3b3b3]\"
                        />
                        <label
                          htmlFor=\"explicit\"
                          className=\"text-sm font-medium text-white cursor-pointer\"
                        >
                          Exclude explicit content
                        </label>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <Button 
                  onClick={handleApplyFilters} 
                  className=\"w-full h-12 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold\"
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

// Queue Section
const QueueSection = ({ queue, isExpanded, onToggle }) => {
  const playTrack = useStore(state => state.playTrack);

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className=\"p-4\">
        <CollapsibleTrigger className=\"flex items-center justify-between w-full group\">
          <div className=\"flex items-center gap-2\">
            <h3 className=\"text-sm font-semibold text-white\">QUEUE</h3>
            <span className=\"text-xs text-[#b3b3b3]\">({queue.length})</span>
          </div>
          {isExpanded ? <ChevronDown className=\"w-4 h-4 text-[#b3b3b3]\" /> : <ChevronRight className=\"w-4 h-4 text-[#b3b3b3]\" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          {queue.length === 0 ? (
            <div className=\"text-center py-8 mt-4\">
              <div className=\"w-16 h-16 mx-auto mb-3 rounded-full bg-[#232323] flex items-center justify-center\">
                <ListMusic className=\"w-8 h-8 text-[#b3b3b3]\" />
              </div>
              <p className=\"text-sm text-[#b3b3b3] mb-1\">No queue</p>
              <p className=\"text-xs text-[#6a6a6a]\">Apply an algorithm to generate</p>
            </div>
          ) : (
            <Droppable droppableId=\"queue-list\">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    \"space-y-1 mt-4 max-h-96 overflow-y-auto\",
                    snapshot.isDraggingOver && \"bg-[#1DB954]/10 rounded-lg p-2\"
                  )}
                >
                  {queue.map((track, index) => (
                    <Draggable key={`${track.id}-${index}`} draggableId={`${track.id}-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          onClick={() => playTrack(track, index)}
                          className={cn(
                            \"flex items-center gap-2 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition-colors\",
                            snapshot.isDragging && \"opacity-50 shadow-2xl bg-[#282828]\"
                          )}
                        >
                          <div {...provided.dragHandleProps} className=\"cursor-grab active:cursor-grabbing\">
                            <GripVertical className=\"w-3 h-3 text-[#b3b3b3] flex-shrink-0\" />
                          </div>
                          <span className=\"text-xs text-[#b3b3b3] w-4\">{index + 1}</span>
                          <img
                            src={track.albumArt}
                            alt={track.album}
                            className=\"w-8 h-8 rounded-sm flex-shrink-0\"
                          />
                          <div className=\"flex-1 min-w-0\">
                            <div className=\"text-xs font-medium text-white truncate\">{track.name}</div>
                            <div className=\"text-xs text-[#b3b3b3] truncate\">{track.artist}</div>
                          </div>
                          <span className=\"text-xs text-[#b3b3b3]\">{formatDuration(track.duration)}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
