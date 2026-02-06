import requests
from config import SPOTIFY_ACCESS_TOKEN, SPOTIFY_BASE_URL

def spotify_get(endpoint, params=None):
    headers = {
        "Authorization": f"Bearer {SPOTIFY_ACCESS_TOKEN}"
    }
    response = requests.get(
        f"{SPOTIFY_BASE_URL}{endpoint}",
        headers=headers,
        params=params,
    )
    response.raise_for_status()
    return response.json()

def spotify_post(endpoint, body=None):
    headers = {
        "Authorization": f"Bearer {SPOTIFY_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    response = requests.post(
        f"{SPOTIFY_BASE_URL}{endpoint}",
        headers=headers,
        json=body,
    )

    if response.status_code == 204:
        return None

    response.raise_for_status()
    return response.json()
