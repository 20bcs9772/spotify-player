import { create } from 'zustand';

/**
 * Zustand store for managing application state
 */
const useStore = create((set, get) => ({
  // Authentication
  isAuthenticated: false,
  accessToken: null,
  user: null,

  login: (token, userData) => set({ 
    isAuthenticated: true, 
    accessToken: token,
    user: userData 
  }),
  
  logout: () => set({ 
    isAuthenticated: false, 
    accessToken: null,
    user: null,
    stagingPool: [],
    queue: [],
    currentTrack: null
  }),

  // Staging Pool (Albums, Artists, Playlists added by user)
  stagingPool: [],

  addToStagingPool: (item) => set((state) => {
    // Check if item already exists
    const exists = state.stagingPool.some(poolItem => poolItem.id === item.id);
    if (exists) return state;
    
    return { 
      stagingPool: [...state.stagingPool, item] 
    };
  }),

  removeFromStagingPool: (itemId) => set((state) => ({
    stagingPool: state.stagingPool.filter(item => item.id !== itemId)
  })),

  reorderStagingPool: (newOrder) => set({ stagingPool: newOrder }),

  clearStagingPool: () => set({ stagingPool: [] }),

  // Generated Queue
  queue: [],

  setQueue: (tracks) => set({ queue: tracks }),

  clearQueue: () => set({ queue: [] }),

  removeFromQueue: (trackId) => set((state) => ({
    queue: state.queue.filter(track => track.id !== trackId)
  })),

  // Playback State
  isPlaying: false,
  currentTrack: null,
  currentTrackIndex: -1,
  playerDeviceId: null,

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  setCurrentTrack: (track, index) => set({ 
    currentTrack: track,
    currentTrackIndex: index 
  }),

  playTrack: (track, index) => set({ 
    currentTrack: track,
    currentTrackIndex: index,
    isPlaying: true 
  }),

  nextTrack: () => {
    const { queue, currentTrackIndex } = get();
    if (currentTrackIndex < queue.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      const nextTrack = queue[nextIndex];
      set({ 
        currentTrack: nextTrack,
        currentTrackIndex: nextIndex,
        isPlaying: true
      });
    }
  },

  previousTrack: () => {
    const { queue, currentTrackIndex } = get();
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1;
      const prevTrack = queue[prevIndex];
      set({ 
        currentTrack: prevTrack,
        currentTrackIndex: prevIndex,
        isPlaying: true
      });
    }
  },

  togglePlayPause: () => set((state) => ({ 
    isPlaying: !state.isPlaying 
  })),

  setPlayerDeviceId: (deviceId) => set({ playerDeviceId: deviceId }),

  // Filter Options
  filterOptions: {
    genres: [],
    minYear: 1950,
    maxYear: new Date().getFullYear(),
    excludeExplicit: false,
    minPopularity: 0
  },

  setFilterOptions: (options) => set({ filterOptions: options }),
}));

export default useStore;