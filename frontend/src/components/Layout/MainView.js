import React, { useState } from 'react';
import { Play, Search as SearchIcon } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import useStore from '../../store/useStore';
import { mockAlbums, mockArtists, mockPlaylists } from '../../utils/mockData';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export const MainView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('albums');
  
  const stagingPool = useStore(state => state.stagingPool);
  const addToStagingPool = useStore(state => state.addToStagingPool);

  const filteredAlbums = mockAlbums.filter(album =>
    album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArtists = mockArtists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlaylists = mockPlaylists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (item) => {
    const exists = stagingPool.some(poolItem => poolItem.id === item.id);
    if (!exists) {
      addToStagingPool(item);
      toast.success(`Added ${item.name} to staging pool`);
    }
  };

  return (
    <div className="flex-1 bg-spotify-dark rounded-lg overflow-hidden relative flex flex-col">
      <ScrollArea className="flex-1">
        <SearchView
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredAlbums={filteredAlbums}
          filteredArtists={filteredArtists}
          filteredPlaylists={filteredPlaylists}
          onAdd={handleAdd}
          stagingPool={stagingPool}
        />
      </ScrollArea>
    </div>
  );
};

const NavButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-full text-sm font-medium transition-colors",
      active
        ? "bg-white text-black"
        : "bg-[#232323] text-white hover:bg-[#2a2a2a]"
    )}
  >
    {label}
  </button>
);

const SearchView = ({ 
  searchQuery, 
  setSearchQuery, 
  activeTab, 
  setActiveTab,
  filteredAlbums,
  filteredArtists,
  filteredPlaylists,
  onAdd,
  stagingPool
}) => {
  return (
    <div className="spotify-gradient-blue min-h-full p-6">
      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-6xl font-black tracking-tighter mb-4">Search</h1>
        <p className="text-[#b3b3b3] text-lg">Find albums, artists, and playlists to mix</p>
      </div>

      {/* Search Input */}
      <div className="mb-6 max-w-xl">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b3b3b3]" />
          <Input
            placeholder="Search for albums, artists, playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#242424] border-none h-12 text-white placeholder:text-[#b3b3b3] focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent border-b border-[#282828] rounded-none h-12 p-0 gap-6 mb-6">
          <TabsTrigger 
            value="albums" 
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-[#b3b3b3] rounded-none px-0 pb-3"
          >
            Albums
          </TabsTrigger>
          <TabsTrigger 
            value="artists"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-[#b3b3b3] rounded-none px-0 pb-3"
          >
            Artists
          </TabsTrigger>
          <TabsTrigger 
            value="playlists"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-[#b3b3b3] rounded-none px-0 pb-3"
          >
            Playlists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="albums" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAlbums.map(album => (
              <SearchCard key={album.id} item={album} onAdd={onAdd} stagingPool={stagingPool} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="artists" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredArtists.map(artist => (
              <SearchCard key={artist.id} item={artist} onAdd={onAdd} stagingPool={stagingPool} isArtist />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="playlists" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredPlaylists.map(playlist => (
              <SearchCard key={playlist.id} item={playlist} onAdd={onAdd} stagingPool={stagingPool} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SearchCard = ({ item, onAdd, stagingPool, isArtist = false }) => {
  const isAdded = stagingPool.some(poolItem => poolItem.id === item.id);

  return (
    <div className="group p-4 bg-[#181818] hover:bg-[#282828] rounded-md transition-all cursor-pointer">
      <div className="relative mb-4">
        <img
          src={item.image}
          alt={item.name}
          className={cn(
            "w-full aspect-square object-cover shadow-lg mb-4",
            isArtist ? "rounded-full" : "rounded-md"
          )}
        />
        {!isAdded && (
          <button
            onClick={() => onAdd(item)}
            className="absolute bottom-2 right-2 w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-105 hover:bg-[#1ed760]"
          >
            <Play className="w-6 h-6 text-black fill-black ml-0.5" />
          </button>
        )}
      </div>
      <div className="mb-1">
        <h3 className="text-white font-bold text-sm truncate">{item.name}</h3>
      </div>
      <p className="text-[#b3b3b3] text-xs truncate">
        {item.type === 'album' && `${item.year} • ${item.artist}`}
        {item.type === 'artist' && 'Artist'}
        {item.type === 'playlist' && `By ${item.owner}`}
      </p>
      {isAdded && (
        <p className="text-[#1DB954] text-xs mt-1">✓ Added to pool</p>
      )}
    </div>
  );
};

const StagingView = () => {
  const stagingPool = useStore(state => state.stagingPool);
  const removeFromStagingPool = useStore(state => state.removeFromStagingPool);
  const clearStagingPool = useStore(state => state.clearStagingPool);
  const setQueue = useStore(state => state.setQueue);
  const playTrack = useStore(state => state.playTrack);
  
  const allTracks = [];
  stagingPool.forEach(item => {
    const tracks = item.type === 'artist' ? item.topTracks : item.tracks;
    tracks?.forEach(track => {
      allTracks.push({ ...track, sourceId: item.id, sourceName: item.name });
    });
  });

  const handlePlayAll = () => {
    if (allTracks.length > 0) {
      setQueue(allTracks);
      playTrack(allTracks[0], 0);
      toast.success(`Playing ${allTracks.length} tracks`);
    }
  };

  return (
    <div className="spotify-gradient-purple min-h-full">
      {/* Hero */}
      <div className="p-6 pb-6">
        <h1 className="text-6xl font-black tracking-tighter mb-4">Staging Pool</h1>
        <p className="text-[#b3b3b3] text-lg mb-6">
          {stagingPool.length} sources • {allTracks.length} tracks
        </p>

        {/* Action Bar */}
        {stagingPool.length > 0 && (
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayAll}
              className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-lg"
            >
              <Play className="w-6 h-6 text-black fill-black ml-0.5" />
            </button>
            <button className="text-[#b3b3b3] hover:text-white transition-colors">
              <Heart size={32} />
            </button>
            <button 
              onClick={clearStagingPool}
              className="text-[#b3b3b3] hover:text-white transition-colors"
            >
              <MoreHorizontal size={32} />
            </button>
          </div>
        )}
      </div>

      {/* Tracklist */}
      <div className="px-6 pb-6">
        {stagingPool.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#b3b3b3] text-lg">No items in staging pool</p>
            <p className="text-[#6a6a6a] text-sm mt-2">Go to Search to add albums, artists, or playlists</p>
          </div>
        ) : (
          <div className="space-y-6">
            {stagingPool.map((item, itemIndex) => {
              const tracks = item.type === 'artist' ? item.topTracks : item.tracks;
              
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center gap-4 mb-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className={cn(
                        "w-16 h-16 object-cover",
                        item.type === 'artist' ? 'rounded-full' : 'rounded-md'
                      )}
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{item.name}</h3>
                      <p className="text-[#b3b3b3] text-sm">
                        {item.type === 'album' && item.artist}
                        {item.type === 'artist' && 'Artist'}
                        {item.type === 'playlist' && `By ${item.owner}`}
                      </p>
                    </div>
                    <Button
                      onClick={() => removeFromStagingPool(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-[#b3b3b3] hover:text-white"
                    >
                      Remove
                    </Button>
                  </div>

                  {/* Tracks Table */}
                  <div className="space-y-1">
                    {tracks?.map((track, trackIndex) => (
                      <div
                        key={track.id}
                        className="group grid grid-cols-[16px_1fr_1fr_80px] gap-4 px-4 py-2 hover:bg-[#2a2a2a] rounded-md items-center"
                      >
                        <div className="text-[#b3b3b3] text-sm">{trackIndex + 1}</div>
                        <div>
                          <div className="text-white text-sm">{track.name}</div>
                          <div className="text-[#b3b3b3] text-xs">{track.artist}</div>
                        </div>
                        <div className="text-[#b3b3b3] text-sm truncate">{track.album}</div>
                        <div className="text-[#b3b3b3] text-sm text-right">
                          {formatDuration(track.duration)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const AlgorithmsView = () => {
  const stagingPool = useStore(state => state.stagingPool);
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
    }
  };

  const algorithms = [
    {
      id: 'shuffle',
      name: 'Shuffle All',
      description: 'Randomize all tracks from your staging pool',
      action: () => executeAlgorithm(() => shuffleTracks(allTracks), 'Shuffle'),
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 'interleave',
      name: 'Interleave Sources',
      description: 'Alternate tracks between different albums/artists',
      action: () => executeAlgorithm(() => interleaveTracks(stagingPool), 'Interleave'),
      gradient: 'from-blue-600 to-cyan-600',
      disabled: stagingPool.length < 2
    },
    {
      id: 'date',
      name: 'Sort by Release Date',
      description: 'Order tracks from newest to oldest',
      action: () => executeAlgorithm(() => sortByReleaseDate(allTracks, false), 'Sort by Date'),
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      id: 'popularity',
      name: 'Sort by Popularity',
      description: 'Most popular tracks first',
      action: () => executeAlgorithm(() => sortByPopularity(allTracks, false), 'Sort by Popularity'),
      gradient: 'from-orange-600 to-red-600'
    },
    {
      id: 'alphabetical',
      name: 'Sort Alphabetically',
      description: 'A to Z by track name',
      action: () => executeAlgorithm(() => sortAlphabetically(allTracks, true), 'Sort Alphabetically'),
      gradient: 'from-indigo-600 to-purple-600'
    }
  ];

  return (
    <div className="spotify-gradient-green min-h-full p-6">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-6xl font-black tracking-tighter mb-4">Mix Controls</h1>
        <p className="text-[#b3b3b3] text-lg">Apply algorithms to create your perfect queue</p>
      </div>

      {/* Algorithms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        {algorithms.map((algo) => (
          <button
            key={algo.id}
            onClick={!algo.disabled ? algo.action : undefined}
            disabled={algo.disabled}
            className={cn(
              "p-6 bg-[#181818] hover:bg-[#282828] rounded-lg transition-all text-left",
              algo.disabled && "opacity-50 cursor-not-allowed hover:bg-[#181818]"
            )}
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${algo.gradient} mb-4`} />
            <h3 className="text-white font-bold text-lg mb-2">{algo.name}</h3>
            <p className="text-[#b3b3b3] text-sm">{algo.description}</p>
            {algo.disabled && (
              <p className="text-[#ff4444] text-xs mt-2">Add at least 2 sources</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainView;