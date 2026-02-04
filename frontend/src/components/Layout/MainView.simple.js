import React from 'react';

export const MainView = () => {
  return (
    <div className="flex-1 bg-spotify-dark rounded-lg overflow-hidden relative flex flex-col">
      <div className="p-6">
        <h1 className="text-6xl font-black tracking-tighter mb-4">Search</h1>
        <p className="text-[#b3b3b3] text-lg">Find albums, artists, and playlists to mix</p>
      </div>
    </div>
  );
};

export default MainView;