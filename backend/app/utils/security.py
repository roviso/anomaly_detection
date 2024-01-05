from passlib.context import CryptContext
from fastapi_sessions.backends.implementations import InMemoryBackend
from fastapi_sessions.frontends.implementations import SessionCookie, CookieParameters
from fastapi_sessions.session_verifier import SessionVerifier

from fastapi import Cookie, HTTPException



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# Assuming you have a session backend
session_backend = InMemoryBackend()


# Set up cookie parameters
cookie_params = CookieParameters(
    max_age=14 * 24 * 60 * 60,  # 14 days, in seconds
    path="/",
    secure=False,  # Set to True if using HTTPS
    httponly=True,
    samesite="lax",  # or "none" for cross-site access if needed
)

# Initialize SessionCookie
session_cookie = SessionCookie(
    cookie_name="sessionId",
    identifier="user_session",
    secret_key="your_secret_key",  # Use a secure, unique secret key
    cookie_params=cookie_params
)



def get_session_id_from_cookie(sessionId: str = Cookie(None)):
    if sessionId is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return sessionId