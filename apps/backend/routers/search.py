from fastapi import APIRouter
from services.search import search

router = APIRouter(prefix="/api/search", tags=["Search"])

@router.get("/")
def searchSpotify(q:str, type:str):
    return search(q, type)