import React from 'react';
import { Music2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import useStore from '../../store/useStore';
import { mockUser } from '../../utils/mockData';

export const LoginPage = () => {
  const login = useStore(state => state.login);

  const handleLogin = () => {
    // Mock authentication
    const mockToken = 'mock-access-token-' + Date.now();
    login(mockToken, mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface via-background to-surface relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-effect rounded-2xl p-8 sm:p-12 shadow-2xl animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary to-primary-hover p-4 rounded-full">
                <Music2 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Spotify Combiner
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Mix, match, and master your perfect playlist
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <Feature 
              icon={<Sparkles className="w-5 h-5" />}
              text="Combine multiple albums, artists, and playlists"
            />
            <Feature 
              icon={<Sparkles className="w-5 h-5" />}
              text="Apply smart algorithms to create unique mixes"
            />
            <Feature 
              icon={<Sparkles className="w-5 h-5" />}
              text="Control playback on all your devices"
            />
          </div>

          {/* Login button */}
          <Button 
            onClick={handleLogin}
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary-hover text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
          >
            <Music2 className="w-5 h-5 mr-2" />
            Continue with Spotify
          </Button>

          <p className="text-center text-sm text-subdued mt-6">
            Demo mode - No actual Spotify login required
          </p>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, text }) => (
  <div className="flex items-start gap-3 text-muted-foreground">
    <div className="text-primary mt-0.5">{icon}</div>
    <span className="text-sm">{text}</span>
  </div>
);