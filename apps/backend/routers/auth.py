from fastapi import APIRouter
from services.auth import login, callback

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.get("/login")
def user_login():
    return login()

@router.get("/callback")
def user_callback(code:str):
    return callback(code)