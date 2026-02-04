import React, { useState } from 'react';
import { Search, Disc, User, ListMusic } from 'lucide-react';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { SearchResult } from './SearchResult';
import { mockAlbums, mockArtists, mockPlaylists } from '../../utils/mockData';

export const SearchPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('albums');

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

  return (
    <div className="h-full flex flex-col bg-surface rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold mb-4">Search Content</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search albums, artists, playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border h-11"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 bg-surface-elevated mx-6 mt-4">
          <TabsTrigger value="albums" className="gap-2">
            <Disc className="w-4 h-4" />
            <span className="hidden sm:inline">Albums</span>
          </TabsTrigger>
          <TabsTrigger value="artists" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Artists</span>
          </TabsTrigger>
          <TabsTrigger value="playlists" className="gap-2">
            <ListMusic className="w-4 h-4" />
            <span className="hidden sm:inline">Playlists</span>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="albums" className="p-6 pt-4 space-y-2 mt-0">
            {filteredAlbums.length === 0 ? (
              <EmptyState message="No albums found" />
            ) : (
              filteredAlbums.map(album => (
                <SearchResult key={album.id} item={album} />
              ))
            )}
          </TabsContent>

          <TabsContent value="artists" className="p-6 pt-4 space-y-2 mt-0">
            {filteredArtists.length === 0 ? (
              <EmptyState message="No artists found" />
            ) : (
              filteredArtists.map(artist => (
                <SearchResult key={artist.id} item={artist} />
              ))
            )}
          </TabsContent>

          <TabsContent value="playlists" className="p-6 pt-4 space-y-2 mt-0">
            {filteredPlaylists.length === 0 ? (
              <EmptyState message="No playlists found" />
            ) : (
              filteredPlaylists.map(playlist => (
                <SearchResult key={playlist.id} item={playlist} />
              ))
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Search className="w-16 h-16 text-muted-foreground opacity-50 mb-4" />
    <p className="text-muted-foreground">{message}</p>
  </div>
);