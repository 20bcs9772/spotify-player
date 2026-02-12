from pydantic import BaseModel
from typing import Optional, List

class CreatePlaylistRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    public: Optional[bool] = True
    uris: Optional[List[str]] = None
    position: Optional[int] = None
    playlistId: Optional[str] = None