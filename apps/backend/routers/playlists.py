from fastapi import APIRouter
from services.playlists import get_my_playlists, create_playlist
from schemas.playlists import CreatePlaylistRequest

router = APIRouter(prefix="/api/playlist", tags=["Playlists"])

@router.get("/me")
def get_my_playlist():
    return get_my_playlists()

@router.post("/me")
def create_my_playlist(body: CreatePlaylistRequest):
    return create_playlist(body)