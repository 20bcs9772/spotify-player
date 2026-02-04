// Type definitions for Spotify Combiner

/**
 * @typedef {Object} SpotifyAlbum
 * @property {string} id
 * @property {string} name
 * @property {string} artist
 * @property {string} image
 * @property {number} year
 * @property {Array<SpotifyTrack>} tracks
 * @property {string} type - 'album'
 */

/**
 * @typedef {Object} SpotifyArtist
 * @property {string} id
 * @property {string} name
 * @property {string} image
 * @property {Array<string>} genres
 * @property {Array<SpotifyTrack>} topTracks
 * @property {string} type - 'artist'
 */

/**
 * @typedef {Object} SpotifyPlaylist
 * @property {string} id
 * @property {string} name
 * @property {string} owner
 * @property {string} image
 * @property {Array<SpotifyTrack>} tracks
 * @property {string} type - 'playlist'
 */

/**
 * @typedef {Object} SpotifyTrack
 * @property {string} id
 * @property {string} name
 * @property {string} artist
 * @property {string} album
 * @property {string} albumArt
 * @property {number} duration - in milliseconds
 * @property {number} year
 * @property {boolean} explicit
 * @property {string} genre
 * @property {number} popularity
 * @property {string} uri
 */

/**
 * @typedef {SpotifyAlbum | SpotifyArtist | SpotifyPlaylist} StagingPoolItem
 */

/**
 * @typedef {Object} QueueTrack
 * @property {string} id
 * @property {string} name
 * @property {string} artist
 * @property {string} album
 * @property {string} albumArt
 * @property {number} duration
 * @property {string} uri
 * @property {string} sourceId - ID of the album/artist/playlist this came from
 * @property {string} sourceType - 'album', 'artist', or 'playlist'
 */

/**
 * @typedef {Object} AlgorithmOption
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 */

/**
 * @typedef {Object} FilterOptions
 * @property {Array<string>} genres
 * @property {number} minYear
 * @property {number} maxYear
 * @property {boolean} excludeExplicit
 * @property {number} minPopularity
 */

export default {};