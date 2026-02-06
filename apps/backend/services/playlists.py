from services.spotify_client import spotify_get, spotify_post

def get_my_playlists():
    return spotify_get("/me/playlists")

def create_playlist(data):
    body={
        "name": data.name,
        "description": data.description or "",
        "public": data.public if data.public is not None else True
    }
    return spotify_post("/me/playlists", body)