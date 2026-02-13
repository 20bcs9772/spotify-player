import React from "react";
import { Music2, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import useStore from "../../store/useStore";
import { apiUrl } from "@/constants";

export const LoginPage = () => {
  const login = useStore((state) => state.login);

  const handleLogin = () => {
    window.location.href = `${apiUrl}/auth/login`;
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Spotify-style gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954] via-[#121212] to-black opacity-80" />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-[#121212] rounded-2xl p-8 sm:p-12 shadow-2xl border border-[#282828] animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-[#1DB954] p-5 rounded-full">
              <Music2 className="w-12 h-12 text-black" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight">
              Spotify Combiner
            </h1>
            <p className="text-[#b3b3b3] text-base sm:text-lg">
              Mix, match, and master your perfect playlist
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <Feature
              icon={<Sparkles className="w-4 h-4" />}
              text="Combine albums, artists, and playlists"
            />
            <Feature
              icon={<Sparkles className="w-4 h-4" />}
              text="Apply smart mixing algorithms"
            />
            <Feature
              icon={<Sparkles className="w-4 h-4" />}
              text="Control playback on all your devices"
            />
          </div>

          {/* Login button */}
          <Button
            onClick={handleLogin}
            className="w-full h-14 text-base font-bold bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-full transition-all duration-200 hover:scale-105"
          >
            Continue with Spotify
          </Button>

          <p className="text-center text-sm text-[#727272] mt-6">
            Demo mode - No actual Spotify login required
          </p>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-[#b3b3b3]">
    <div className="text-[#1DB954]">{icon}</div>
    <span className="text-sm">{text}</span>
  </div>
);
