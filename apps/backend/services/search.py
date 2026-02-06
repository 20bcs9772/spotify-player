from services.spotify_client import spotify_get

def search(q:str ="", type:str="album,playlist,artist,track"):
    params= {
        "q": q,
        "type": type
    }
    return spotify_get("/search", params)