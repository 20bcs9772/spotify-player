import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import useStore from "../../store/useStore";
import { mockAlbums, mockArtists, mockPlaylists } from "../../utils/mockData";
import { toast } from "sonner";
import { PlaylistView } from "../Views/Playlist";
import { SearchView } from "../Views/Search";

export const MainView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("albums");

  const selectedPlaylist = useStore((state) => state.selectedPlaylist);
  const stagingPool = useStore((state) => state.stagingPool);
  const addToStagingPool = useStore((state) => state.addToStagingPool);

  const filteredAlbums = mockAlbums.filter(
    (album) =>
      album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredArtists = mockArtists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredPlaylists = mockPlaylists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAdd = (item) => {
    const exists = stagingPool.some((poolItem) => poolItem.id === item.id);
    if (!exists) {
      addToStagingPool(item);
      toast.success(`Added ${item.name} to staging pool`);
    }
  };

  return (
    <div className="flex-1 bg-spotify-dark rounded-lg overflow-hidden relative flex flex-col">
      <ScrollArea className="flex-1">
        {selectedPlaylist === "home" || selectedPlaylist === "search" ? (
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
        ) : (
          <PlaylistView onAddToPool={handleAdd} />
        )}
      </ScrollArea>
    </div>
  );
};

export default MainView;
