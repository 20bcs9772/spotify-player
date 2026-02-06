import React, { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import useStore from './store/useStore';
import { LoginPage } from './components/Auth/LoginPage';
import { LeftSidebar } from './components/Layout/LeftSidebar';
import { RightPanel } from './components/Layout/RightPanel';
import { MainView } from './components/Layout/MainView';
import { BottomPlayer } from './components/Layout/BottomPlayer';
import './App.css';

function App() {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      {/* Main Layout - Spotify 3-pane grid */}
      <div className="h-[calc(100vh-90px)] p-2 flex gap-2">
        {/* Left Sidebar - Playlists */}
        <LeftSidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content Area - Search & Browse */}
        <MainView />

        {/* Right Panel - Combiner Features */}
        <RightPanel />
      </div>

      {/* Bottom Player Bar */}
      <BottomPlayer />

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;