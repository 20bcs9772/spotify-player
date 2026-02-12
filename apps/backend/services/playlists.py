from services.spotify_client import spotify_get, spotify_post

def get_my_playlists():
    return spotify_get("/me/playlists")

def create_playlist(data):
    body={
        "name": data.name,
        "description": data.description or "",
        "public": data.public if data.public is not None else True
    }
    response = spotify_post("/me/playlists", body)
    if data.uris:
        data.playlistId = response["id"]
        add_tracks_to_playlist(data)
        return get_playlist_by_id(response["id"])
    else:
        return response

def add_tracks_to_playlist(data):
    body={
        "uris": data.uris,
        "position": data.position or 0
    }
    return spotify_post(f"/playlists/{data.playlistId}/items", body)

def get_playlist_by_id(playlistId:str):
    return spotify_get(f"/playlists/{playlistId}")