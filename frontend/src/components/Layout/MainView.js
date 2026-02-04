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

export default MainView;