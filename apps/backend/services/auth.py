from config import SPOTIFY_ACCOUNT_URL, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI, SPOTIFY_CLIENT_URL
from fastapi.responses import RedirectResponse
import requests
import base64

TOKENS = {}

def login():
    scope = "playlist-read-private playlist-modify-public playlist-modify-private"

    auth_url = (
        f"{SPOTIFY_ACCOUNT_URL}/authorize"
        f"?response_type=code"
        f"&client_id={SPOTIFY_CLIENT_ID}"
        f"&scope={scope}"
        f"&redirect_uri={SPOTIFY_REDIRECT_URI}"
    )

    return RedirectResponse(auth_url)


def callback(code: str):
    auth_header = base64.b64encode(
        f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}".encode()
    ).decode()

    response = requests.post(
        f"{SPOTIFY_ACCOUNT_URL}/api/token",
        headers={
            "Authorization": f"Basic {auth_header}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": SPOTIFY_REDIRECT_URI,
        },
    )

    response.raise_for_status()
    token_data = response.json()

    TOKENS["access_token"] = token_data["access_token"]
    TOKENS["refresh_token"] = token_data["refresh_token"]

    return RedirectResponse(SPOTIFY_CLIENT_URL)
