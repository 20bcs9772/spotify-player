import { Search as SearchIcon, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "../../lib/utils";

export const SearchView = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  filteredAlbums,
  filteredArtists,
  filteredPlaylists,
  onAdd,
  stagingPool,
}) => {
  return (
    <div className="spotify-gradient-blue min-h-full p-6">
      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-6xl font-black tracking-tighter mb-4">Search</h1>
        <p className="text-[#b3b3b3] text-lg">
          Find albums, artists, and playlists to mix
        </p>
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

        <div id="search-results">
          <TabsContent value="albums" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredAlbums.map((album, index) => (
                <SearchCard
                  key={album.id}
                  item={album}
                  index={index}
                  onAdd={onAdd}
                  stagingPool={stagingPool}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artists" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredArtists.map((artist, index) => (
                <SearchCard
                  key={artist.id}
                  item={artist}
                  index={index}
                  onAdd={onAdd}
                  stagingPool={stagingPool}
                  isArtist
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPlaylists.map((playlist, index) => (
                <SearchCard
                  key={playlist.id}
                  item={playlist}
                  index={index}
                  onAdd={onAdd}
                  stagingPool={stagingPool}
                />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

const SearchCard = ({ item, onAdd, stagingPool, isArtist = false }) => {
  const isAdded = stagingPool.some((poolItem) => poolItem.id === item.id);

  return (
    <div
      id={item.id}
      key={item.id}
      className="group p-4 bg-[#181818] hover:bg-[#282828] rounded-md transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex flex-col justify-center">
        <div className="relative mb-4 pointer-events-none">
          <img
            src={item.image}
            alt={item.name}
            className={cn(
              "w-full aspect-square object-cover shadow-lg mb-4",
              isArtist ? "rounded-full" : "rounded-md",
            )}
          />
        </div>

        <h3 className="text-white font-bold text-sm truncate pointer-events-none">
          {item.name}
        </h3>

        <p className="text-[#b3b3b3] text-xs truncate pointer-events-none">
          {item.type === "album" && `${item.year} • ${item.artist}`}
          {item.type === "artist" && "Artist"}
          {item.type === "playlist" && `By ${item.owner}`}
        </p>

        {isAdded && (
          <p className="text-[#1DB954] text-xs mt-1 pointer-events-none">
            ✓ Added to pool
          </p>
        )}

        {!isAdded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(item);
            }}
            className="w-10 h-10 z-10 bg-[#1DB954] rounded-full ml-auto flex items-center  justify-center opacity-50 group-hover:opacity-100 transition-all shadow-lg hover:scale-105 hover:bg-[#1ed760]"
          >
            <Plus className="w-5 h-5 text-black" />
          </button>
        )}
      </div>
    </div>
  );
};