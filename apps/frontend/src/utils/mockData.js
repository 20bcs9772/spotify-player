// Mock data for Spotify Combiner

export const mockAlbums = [
  {
    id: 'album-1',
    name: 'The Dark Side of the Moon',
    artist: 'Pink Floyd',
    image: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe',
    year: 1973,
    type: 'album',
    tracks: [
      { id: 'track-1-1', name: 'Speak to Me', artist: 'Pink Floyd', album: 'The Dark Side of the Moon', albumArt: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe', duration: 90000, year: 1973, explicit: false, genre: 'Progressive Rock', popularity: 85, uri: 'spotify:track:1' },
      { id: 'track-1-2', name: 'Breathe', artist: 'Pink Floyd', album: 'The Dark Side of the Moon', albumArt: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe', duration: 163000, year: 1973, explicit: false, genre: 'Progressive Rock', popularity: 88, uri: 'spotify:track:2' },
      { id: 'track-1-3', name: 'Time', artist: 'Pink Floyd', album: 'The Dark Side of the Moon', albumArt: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe', duration: 413000, year: 1973, explicit: false, genre: 'Progressive Rock', popularity: 92, uri: 'spotify:track:3' },
      { id: 'track-1-4', name: 'Money', artist: 'Pink Floyd', album: 'The Dark Side of the Moon', albumArt: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe', duration: 382000, year: 1973, explicit: false, genre: 'Progressive Rock', popularity: 90, uri: 'spotify:track:4' }
    ]
  },
  {
    id: 'album-2',
    name: 'Currents',
    artist: 'Tame Impala',
    image: 'https://i.scdn.co/image/ab67616d0000b27379dff57739f0e2b1b5616fa2',
    year: 2015,
    type: 'album',
    tracks: [
      { id: 'track-2-1', name: 'Let It Happen', artist: 'Tame Impala', album: 'Currents', albumArt: 'https://i.scdn.co/image/ab67616d0000b27379dff57739f0e2b1b5616fa2', duration: 467000, year: 2015, explicit: false, genre: 'Psychedelic Rock', popularity: 87, uri: 'spotify:track:5' },
      { id: 'track-2-2', name: 'The Moment', artist: 'Tame Impala', album: 'Currents', albumArt: 'https://i.scdn.co/image/ab67616d0000b27379dff57739f0e2b1b5616fa2', duration: 255000, year: 2015, explicit: false, genre: 'Psychedelic Rock', popularity: 82, uri: 'spotify:track:6' },
      { id: 'track-2-3', name: "The Less I Know The Better", artist: 'Tame Impala', album: 'Currents', albumArt: 'https://i.scdn.co/image/ab67616d0000b27379dff57739f0e2b1b5616fa2', duration: 216000, year: 2015, explicit: false, genre: 'Psychedelic Rock', popularity: 95, uri: 'spotify:track:7' }
    ]
  },
  {
    id: 'album-3',
    name: 'Random Access Memories',
    artist: 'Daft Punk',
    image: 'https://i.scdn.co/image/ab67616d0000b273ff8ca2c1870a58ba886e6e19',
    year: 2013,
    type: 'album',
    tracks: [
      { id: 'track-3-1', name: 'Give Life Back to Music', artist: 'Daft Punk', album: 'Random Access Memories', albumArt: 'https://i.scdn.co/image/ab67616d0000b273ff8ca2c1870a58ba886e6e19', duration: 274000, year: 2013, explicit: false, genre: 'Electronic', popularity: 78, uri: 'spotify:track:8' },
      { id: 'track-3-2', name: 'Get Lucky', artist: 'Daft Punk', album: 'Random Access Memories', albumArt: 'https://i.scdn.co/image/ab67616d0000b273ff8ca2c1870a58ba886e6e19', duration: 368000, year: 2013, explicit: false, genre: 'Electronic', popularity: 93, uri: 'spotify:track:9' },
      { id: 'track-3-3', name: 'Instant Crush', artist: 'Daft Punk', album: 'Random Access Memories', albumArt: 'https://i.scdn.co/image/ab67616d0000b273ff8ca2c1870a58ba886e6e19', duration: 337000, year: 2013, explicit: false, genre: 'Electronic', popularity: 85, uri: 'spotify:track:10' }
    ]
  },
  {
    id: 'album-4',
    name: 'Abbey Road',
    artist: 'The Beatles',
    image: 'https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25',
    year: 1969,
    type: 'album',
    tracks: [
      { id: 'track-4-1', name: 'Come Together', artist: 'The Beatles', album: 'Abbey Road', albumArt: 'https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25', duration: 259000, year: 1969, explicit: false, genre: 'Rock', popularity: 91, uri: 'spotify:track:11' },
      { id: 'track-4-2', name: 'Something', artist: 'The Beatles', album: 'Abbey Road', albumArt: 'https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25', duration: 182000, year: 1969, explicit: false, genre: 'Rock', popularity: 88, uri: 'spotify:track:12' },
      { id: 'track-4-3', name: 'Here Comes the Sun', artist: 'The Beatles', album: 'Abbey Road', albumArt: 'https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25', duration: 185000, year: 1969, explicit: false, genre: 'Rock', popularity: 94, uri: 'spotify:track:13' }
    ]
  }
];

export const mockArtists = [
  {
    id: 'artist-1',
    name: 'Radiohead',
    image: 'https://i.scdn.co/image/ab6761610000e5eba03696716c9ee605006047fd',
    genres: ['Alternative Rock', 'Art Rock'],
    type: 'artist',
    topTracks: [
      { id: 'track-a1-1', name: 'Creep', artist: 'Radiohead', album: 'Pablo Honey', albumArt: 'https://i.scdn.co/image/ab67616d0000b273df55e326ed144ab4f5cecf95', duration: 238000, year: 1993, explicit: false, genre: 'Alternative Rock', popularity: 90, uri: 'spotify:track:14' },
      { id: 'track-a1-2', name: 'Karma Police', artist: 'Radiohead', album: 'OK Computer', albumArt: 'https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856', duration: 261000, year: 1997, explicit: false, genre: 'Alternative Rock', popularity: 88, uri: 'spotify:track:15' },
      { id: 'track-a1-3', name: 'No Surprises', artist: 'Radiohead', album: 'OK Computer', albumArt: 'https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856', duration: 229000, year: 1997, explicit: false, genre: 'Alternative Rock', popularity: 85, uri: 'spotify:track:16' }
    ]
  },
  {
    id: 'artist-2',
    name: 'Arctic Monkeys',
    image: 'https://i.scdn.co/image/ab6761610000e5eb7f2f8f47bf9c58d2bd3c1989',
    genres: ['Indie Rock', 'Alternative Rock'],
    type: 'artist',
    topTracks: [
      { id: 'track-a2-1', name: 'Do I Wanna Know?', artist: 'Arctic Monkeys', album: 'AM', albumArt: 'https://i.scdn.co/image/ab67616d0000b27394c9217e6f752f75ef570e95', duration: 272000, year: 2013, explicit: false, genre: 'Indie Rock', popularity: 92, uri: 'spotify:track:17' },
      { id: 'track-a2-2', name: "Why'd You Only Call Me When You're High?", artist: 'Arctic Monkeys', album: 'AM', albumArt: 'https://i.scdn.co/image/ab67616d0000b27394c9217e6f752f75ef570e95', duration: 161000, year: 2013, explicit: false, genre: 'Indie Rock', popularity: 87, uri: 'spotify:track:18' },
      { id: 'track-a2-3', name: 'R U Mine?', artist: 'Arctic Monkeys', album: 'AM', albumArt: 'https://i.scdn.co/image/ab67616d0000b27394c9217e6f752f75ef570e95', duration: 201000, year: 2013, explicit: false, genre: 'Indie Rock', popularity: 89, uri: 'spotify:track:19' }
    ]
  }
];

export const mockPlaylists = [
  {
    id: 'playlist-1',
    name: 'Chill Vibes',
    owner: 'Spotify',
    image: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6',
    type: 'playlist',
    tracks: [
      { id: 'track-p1-1', name: 'Electric Feel', artist: 'MGMT', album: 'Oracular Spectacular', albumArt: 'https://i.scdn.co/image/ab67616d0000b273795bc37f0f5b1e5be1d50e29', duration: 228000, year: 2007, explicit: false, genre: 'Indie Pop', popularity: 86, uri: 'spotify:track:20' },
      { id: 'track-p1-2', name: 'Float On', artist: 'Modest Mouse', album: 'Good News for People Who Love Bad News', albumArt: 'https://i.scdn.co/image/ab67616d0000b273c4f685a8dee1d7fce7c71fd3', duration: 208000, year: 2004, explicit: false, genre: 'Indie Rock', popularity: 82, uri: 'spotify:track:21' },
      { id: 'track-p1-3', name: 'Take Me Out', artist: 'Franz Ferdinand', album: 'Franz Ferdinand', albumArt: 'https://i.scdn.co/image/ab67616d0000b273a1f8c2a4e8f1c60b5e3e8b80', duration: 237000, year: 2004, explicit: false, genre: 'Indie Rock', popularity: 84, uri: 'spotify:track:22' }
    ]
  },
  {
    id: 'playlist-2',
    name: 'Rock Classics',
    owner: 'User',
    image: 'https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112',
    type: 'playlist',
    tracks: [
      { id: 'track-p2-1', name: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', albumArt: 'https://i.scdn.co/image/ab67616d0000b2731e7c142c3aa5820a8e8c7407', duration: 354000, year: 1975, explicit: false, genre: 'Rock', popularity: 95, uri: 'spotify:track:23' },
      { id: 'track-p2-2', name: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', albumArt: 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69', duration: 482000, year: 1971, explicit: false, genre: 'Rock', popularity: 93, uri: 'spotify:track:24' },
      { id: 'track-p2-3', name: 'Hotel California', artist: 'Eagles', album: 'Hotel California', albumArt: 'https://i.scdn.co/image/ab67616d0000b273865f4b8c8c7b900e7e6b0b47', duration: 391000, year: 1976, explicit: false, genre: 'Rock', popularity: 91, uri: 'spotify:track:25' }
    ]
  }
];

export const mockUser = {
  id: 'user-1',
  name: 'Music Lover',
  email: 'user@spotify.com',
  image: 'https://i.pravatar.cc/150?img=68'
};