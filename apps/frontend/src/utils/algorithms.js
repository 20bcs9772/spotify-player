/**
 * Utility functions for processing the staging pool and generating queues
 */

/**
 * Extract all tracks from staging pool items
 * Handles both mock data and Spotify API structure
 */
export const extractAllTracks = (stagingPool) => {
  const tracks = [];
  
  stagingPool.forEach(item => {
    if (item.type === 'album') {
      // Spotify albums: tracks.items[] (direct tracks)
      // Mock data: tracks[] (direct tracks)
      const albumTracks = item.tracks?.items || item.tracks || [];
      albumTracks.forEach(track => {
        const trackObj = track.track || track; // Handle nested structure
        tracks.push({
          ...trackObj,
          sourceId: item.id,
          sourceType: item.type,
          sourceName: item.name
        });
      });
    } else if (item.type === 'playlist') {
      // Spotify playlists: tracks.items[].track (nested)
      // Mock data: tracks[] (direct tracks)
      const playlistTracks = item.tracks?.items || item.tracks || [];
      playlistTracks.forEach(playlistItem => {
        const trackObj = playlistItem.track || playlistItem; // Handle nested structure
        tracks.push({
          ...trackObj,
          sourceId: item.id,
          sourceType: item.type,
          sourceName: item.name
        });
      });
    } else if (item.type === 'artist') {
      // Spotify artists: might have topTracks or need separate fetch
      // Mock data: topTracks[]
      const artistTracks = item.topTracks || [];
      artistTracks.forEach(track => {
        tracks.push({
          ...track,
          sourceId: item.id,
          sourceType: item.type,
          sourceName: item.name
        });
      });
    }
  });
  
  return tracks;
};

/**
 * Shuffle algorithm - randomizes all tracks
 */
export const shuffleTracks = (tracks) => {
  const shuffled = [...tracks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Interleave algorithm - alternates tracks between sources
 */
export const interleaveTracks = (stagingPool) => {
  if (stagingPool.length === 0) return [];
  
  // Get tracks grouped by source using extractAllTracks logic
  const tracksBySource = stagingPool.map(item => {
    const sourceTracks = [];
    
    if (item.type === 'album') {
      const albumTracks = item.tracks?.items || item.tracks || [];
      albumTracks.forEach(track => {
        const trackObj = track.track || track;
        sourceTracks.push({
          ...trackObj,
          sourceId: item.id,
          sourceType: item.type,
          sourceName: item.name
        });
      });
    } else if (item.type === 'playlist') {
      const playlistTracks = item.tracks?.items || item.tracks || [];
      playlistTracks.forEach(playlistItem => {
        const trackObj = playlistItem.track || playlistItem;
        sourceTracks.push({
          ...trackObj,
          sourceId: item.id,
          sourceType: item.type,
          sourceName: item.name
        });
      });
    } else if (item.type === 'artist') {
      const artistTracks = item.topTracks || [];
      artistTracks.forEach(track => {
        sourceTracks.push({
          ...track,
          sourceId: item.id,
          sourceType: item.type,
          sourceName: item.name
        });
      });
    }
    
    return sourceTracks;
  });
  
  // Interleave tracks
  const interleaved = [];
  let maxLength = Math.max(...tracksBySource.map(tracks => tracks.length));
  
  for (let i = 0; i < maxLength; i++) {
    tracksBySource.forEach(tracks => {
      if (tracks[i]) {
        interleaved.push(tracks[i]);
      }
    });
  }
  
  return interleaved;
};

/**
 * Sort by release date (year)
 * Handles both mock data (year) and Spotify API (album.release_date)
 */
export const sortByReleaseDate = (tracks, ascending = false) => {
  const sorted = [...tracks];
  sorted.sort((a, b) => {
    // Extract year from release_date (format: "YYYY-MM-DD" or "YYYY")
    const getYear = (track) => {
      if (track.year) return track.year;
      if (track.album?.release_date) {
        const year = parseInt(track.album.release_date.split('-')[0]);
        return isNaN(year) ? 0 : year;
      }
      return 0;
    };
    
    const yearA = getYear(a);
    const yearB = getYear(b);
    return ascending ? yearA - yearB : yearB - yearA;
  });
  return sorted;
};

/**
 * Sort by popularity
 */
export const sortByPopularity = (tracks, ascending = false) => {
  const sorted = [...tracks];
  sorted.sort((a, b) => {
    const popA = a.popularity || 0;
    const popB = b.popularity || 0;
    return ascending ? popA - popB : popB - popA;
  });
  return sorted;
};

/**
 * Sort alphabetically by track name
 */
export const sortAlphabetically = (tracks, ascending = true) => {
  const sorted = [...tracks];
  sorted.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });
  return sorted;
};

/**
 * Filter by genre
 */
export const filterByGenre = (tracks, genres) => {
  if (!genres || genres.length === 0) return tracks;
  
  return tracks.filter(track => 
    genres.some(genre => 
      track.genre && track.genre.toLowerCase().includes(genre.toLowerCase())
    )
  );
};

/**
 * Filter by year range
 * Handles both mock data (year) and Spotify API (album.release_date)
 */
export const filterByYear = (tracks, minYear, maxYear) => {
  return tracks.filter(track => {
    let year = track.year || 0;
    if (!year && track.album?.release_date) {
      year = parseInt(track.album.release_date.split('-')[0]);
      year = isNaN(year) ? 0 : year;
    }
    return year >= minYear && year <= maxYear;
  });
};

/**
 * Filter explicit content
 */
export const filterExplicit = (tracks, excludeExplicit = false) => {
  if (!excludeExplicit) return tracks;
  return tracks.filter(track => !track.explicit);
};

/**
 * Filter by minimum popularity
 */
export const filterByPopularity = (tracks, minPopularity = 0) => {
  return tracks.filter(track => (track.popularity || 0) >= minPopularity);
};

/**
 * Apply all filters
 */
export const applyFilters = (tracks, filterOptions) => {
  let filtered = [...tracks];
  
  if (filterOptions.genres && filterOptions.genres.length > 0) {
    filtered = filterByGenre(filtered, filterOptions.genres);
  }
  
  if (filterOptions.minYear || filterOptions.maxYear) {
    filtered = filterByYear(
      filtered, 
      filterOptions.minYear || 1950, 
      filterOptions.maxYear || new Date().getFullYear()
    );
  }
  
  if (filterOptions.excludeExplicit) {
    filtered = filterExplicit(filtered, true);
  }
  
  if (filterOptions.minPopularity) {
    filtered = filterByPopularity(filtered, filterOptions.minPopularity);
  }
  
  return filtered;
};

/**
 * Format duration in ms to MM:SS
 */
export const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Get unique genres from tracks
 */
export const getUniqueGenres = (tracks) => {
  const genres = new Set();
  tracks.forEach(track => {
    if (track.genre) {
      genres.add(track.genre);
    }
  });
  return Array.from(genres).sort();
};

/**
 * Get year range from tracks
 * Handles both mock data (year) and Spotify API (album.release_date)
 */
export const getYearRange = (tracks) => {
  const years = tracks.map(track => {
    if (track.year) return track.year;
    if (track.album?.release_date) {
      const year = parseInt(track.album.release_date.split('-')[0]);
      return isNaN(year) ? 0 : year;
    }
    return 0;
  }).filter(year => year > 0);
  
  if (years.length === 0) return { min: 1950, max: new Date().getFullYear() };
  
  return {
    min: Math.min(...years),
    max: Math.max(...years)
  };
};