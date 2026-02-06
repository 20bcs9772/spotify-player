import React, { useState } from 'react';
import { Play, Search as SearchIcon, Clock, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import useStore from '../../store/useStore';
import { mockAlbums, mockArtists, mockPlaylists } from '../../utils/mockData';
import { formatDuration } from '../../utils/algorithms';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export const MainView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('albums');
  
  const selectedPlaylist = useStore(state => state.selectedPlaylist);
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

  const handleDragEnd = (result) => {
    // Handle drag from center to right panel
    if (!result.destination) return;
    
    if (result.destination.droppableId === 'staging-pool') {
      const draggedItemId = result.draggableId;
      // Find item in search results
      const allItems = [...filteredAlbums, ...filteredArtists, ...filteredPlaylists];
      const item = allItems.find(i => i.id === draggedItemId);
      if (item) {
        handleAdd(item);
      }
    }
  };

  return (
    <div className="flex-1 bg-spotify-dark rounded-lg overflow-hidden relative flex flex-col">
      <DragDropContext onDragEnd={handleDragEnd}>
        <ScrollArea className="flex-1">
          {selectedPlaylist ? (
            <PlaylistView playlist={selectedPlaylist} onAddToPool={handleAdd} />
          ) : (
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
          )}
        </ScrollArea>
      </DragDropContext>
    </div>
  );
};

const PlaylistView = ({ playlist, onAddToPool }) => {
  return (
    <div className="spotify-gradient-purple min-h-full">
      {/* Hero */}
      <div className="p-6 pb-6 flex items-end gap-6">
        <img
          src={playlist.image}
          alt={playlist.name}
          className="w-56 h-56 rounded-md shadow-2xl"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white mb-2">PLAYLIST</p>
          <h1 className="text-6xl font-black tracking-tighter mb-4">{playlist.name}</h1>
          <p className="text-[#b3b3b3] text-sm mb-2">{playlist.owner}</p>
          <p className="text-[#b3b3b3] text-sm">
            {playlist.tracks?.length || 0} songs
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => onAddToPool(playlist)}
          className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-lg"
        >
          <Plus className="w-6 h-6 text-black" />
        </button>
        <span className="text-sm text-[#b3b3b3]">Add to Staging Pool</span>
      </div>

      {/* Tracklist */}
      <div className="px-6 pb-6">
        <div className="sticky top-0 bg-[#121212]/95 backdrop-blur-md grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 border-b border-[#282828] text-[#b3b3b3] text-xs uppercase">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div className="flex justify-end"><Clock size={16} /></div>
        </div>
        {playlist.tracks && playlist.tracks.length > 0 ? (
          <div className="space-y-1">
            {playlist.tracks.map((track, index) => (
              <div
                key={track.id}
                className="group grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 hover:bg-[#2a2a2a] rounded-md items-center cursor-pointer"
              >
                <div className="text-[#b3b3b3] text-sm">{index + 1}</div>
                <div>
                  <div className="text-white text-sm font-medium">{track.name}</div>
                  <div className="text-[#b3b3b3] text-xs">{track.artist}</div>
                </div>
                <div className="text-[#b3b3b3] text-sm truncate">{track.album}</div>
                <div className="text-[#b3b3b3] text-sm text-right">
                  {formatDuration(track.duration)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#b3b3b3]">No tracks in this playlist</p>
          </div>
        )}
      </div>
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

        <Droppable droppableId="search-results" isDropDisabled={true}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <TabsContent value="albums" className="mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredAlbums.map((album, index) => (
                    <SearchCard key={album.id} item={album} index={index} onAdd={onAdd} stagingPool={stagingPool} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="artists" className="mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredArtists.map((artist, index) => (
                    <SearchCard key={artist.id} item={artist} index={index} onAdd={onAdd} stagingPool={stagingPool} isArtist />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="playlists" className="mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredPlaylists.map((playlist, index) => (
                    <SearchCard key={playlist.id} item={playlist} index={index} onAdd={onAdd} stagingPool={stagingPool} />
                  ))}
                </div>
              </TabsContent>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Tabs>
    </div>
  );
};

const SearchCard = ({ item, index, onAdd, stagingPool, isArtist = false }) => {
  const isAdded = stagingPool.some(poolItem => poolItem.id === item.id);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "group p-4 bg-[#181818] hover:bg-[#282828] rounded-md transition-all cursor-grab active:cursor-grabbing",
            snapshot.isDragging && "opacity-50 shadow-2xl"
          )}
        >
          <div className="relative mb-4 pointer-events-none">
            <img
              src={item.image}
              alt={item.name}
              className={cn(
                "w-full aspect-square object-cover shadow-lg mb-4",
                isArtist ? "rounded-full" : "rounded-md"
              )}
            />
          </div>
          <div className="mb-1 pointer-events-none">
            <h3 className="text-white font-bold text-sm truncate">{item.name}</h3>
          </div>
          <p className="text-[#b3b3b3] text-xs truncate pointer-events-none">
            {item.type === 'album' && `${item.year} \u2022 ${item.artist}`}
            {item.type === 'artist' && 'Artist'}
            {item.type === 'playlist' && `By ${item.owner}`}
          </p>
          {isAdded && (
            <p className="text-[#1DB954] text-xs mt-1 pointer-events-none">\u2713 Added to pool</p>
          )}
          {!isAdded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item);
              }}
              className="absolute top-6 right-6 w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-105 hover:bg-[#1ed760] z-10"
            >
              <Plus className="w-5 h-5 text-black" />
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default MainView;
