import React, { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import useStore from './store/useStore';
import { LoginPage } from './components/Auth/LoginPage';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { PlayerBar } from './components/Layout/PlayerBar';
import { SearchPanel } from './components/Search/SearchPanel';
import { StagingPool } from './components/StagingPool/StagingPool';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { QueueView } from './components/Queue/QueueView';
import { Sheet, SheetContent } from './components/ui/sheet';
import './App.css';

function App() {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

          {/* Dashboard Grid */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 max-w-[1920px] mx-auto">
              {/* Top Section: Search + Staging Pool */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Search Panel */}
                <div className="h-[600px]">
                  <SearchPanel />
                </div>

                {/* Staging Pool */}
                <div className="h-[600px]">
                  <StagingPool />
                </div>
              </div>

              {/* Control Panel */}
              <div className="mb-6">
                <ControlPanel />
              </div>

              {/* Queue */}
              <div className="h-[600px]">
                <QueueView />
              </div>
            </div>
          </main>

          {/* Player Bar */}
          <PlayerBar />
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;