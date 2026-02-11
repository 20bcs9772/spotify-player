import requests
from services.auth import TOKENS
from config import SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_BASE_URL, SPOTIFY_ACCOUNT_URL

def generate_token():
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }
    body = {
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    response = requests.post(
        f"{SPOTIFY_ACCOUNT_URL}/api/token",
        headers=headers,
        data=body,
    )
    tokendata = response.json()
    return tokendata["access_token"]

def spotify_get(endpoint, params=None):
    token = TOKENS["access_token"]

    headers = {
        "Authorization": f"Bearer {token}",
    }
    response = requests.get(
        f"{SPOTIFY_BASE_URL}{endpoint}",
        headers=headers,
        params=params,
    )
    response.raise_for_status()
    return response.json()

def spotify_post(endpoint, body=None):
    token = TOKENS["access_token"]

    headers = {
        "Authorization": f"Bearer {token}",
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
