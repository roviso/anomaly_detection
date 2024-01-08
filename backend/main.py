from fastapi import FastAPI, HTTPException,Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi_csrf_protect import CsrfProtect
from config.settings import authconfig
from config.db import engine, Base
from app.routes import user_router, ambulance_router, account_router, hospital_router, blood_router
import io
import time
import json
import logging
from logging.handlers import RotatingFileHandler
from starlette.datastructures import FormData  # Corrected import
from starlette.types import ASGIApp, Receive, Scope, Send
# from starlette.requests import Request
from starlette.responses import Response

from urllib.parse import parse_qs


# Configure logging
log_file = "log.txt"
# Main logger configuration
logging.basicConfig(
    level=logging.WARNING,  # Set a higher log level if you want less verbosity
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler()  # You might not need a file handler here
    ]
)

logger = logging.getLogger()

# Configure a separate logger for middleware
middleware_log_file = "middleware_log.txt"
middleware_logger = logging.getLogger("middleware_logger")
middleware_logger.setLevel(logging.INFO)
middleware_logger_handler = RotatingFileHandler(middleware_log_file, maxBytes=10000000, backupCount=5)
middleware_logger_handler.setFormatter(logging.Formatter("%(message)s"))
middleware_logger.addHandler(middleware_logger_handler)


from typing import List, Tuple

async def empty_receive() -> dict:
    return {'type': 'http.disconnect'}

def clone_request(request: Request) -> Request:
    async def receive() -> dict:
        body = await request.body()
        return {'type': 'http.request', 'body': body, 'more_body': False}

    cloned_scope = dict(request.scope)
    cloned_scope["receive"] = receive
    return Request(scope=cloned_scope, receive=receive, send=request._send)



class CustomLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        # Clone the request for logging purposes
        request_clone = clone_request(request)
        
        # Process the request   
        client_host = request.client.host
        request_time = time.time()
        request_method = request.method
        request_path = request.url.path
        http_version = request.scope["http_version"]
        referrer = request.headers.get("referer", "-")
        user_agent = request.headers.get("user-agent", "-")
        cookies = request.cookies

        # Read and store the request body
        content_type = request.headers.get("content-type", "")


        form_data = {}

        if "multipart/form-data" in content_type or "application/x-www-form-urlencoded" in content_type:
            form = await request_clone.form()
            form_data = {key: form[key] for key in form}

        body = form_data

        response = await call_next(request_clone)

        response_status = response.status_code

        # response_status = "444"

        process_time = (time.time() - start_time) * 1000
        post_params = {}
        # # Log the details
        post_params = await request_clone.form() if request.method == "POST" else {}
        
        # print(555555,post_params)
        get_params = request.query_params
        log_message = (
            f'{client_host} {request_time} "{request_method} {request_path} HTTP/{http_version}" '
            f'{response_status} {process_time}ms "{referrer}" "{user_agent}" '
            f'- {json.dumps(cookies)} {json.dumps(dict(post_params))} {json.dumps(dict(get_params))} {json.dumps(body)}'
        )
        middleware_logger.info(log_message)
        
        
        return response



# Initialize the FastAPI app
app = FastAPI()
app.add_middleware(CustomLoggingMiddleware)

origins = [
    # "*",
           "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=authconfig.SECRET_KEY,  # Use a strong secret key
    max_age=86400,  # Session expiration time in seconds (optional)
    https_only=False  # Set to `True` in production for HTTPS
)

# # Wrap the FastAPI app with CustomASGIApp
# app = CustomASGIApp(app)


@app.on_event("startup")
async def startup_event():
    # app.add_middleware(SessionMiddleware, secret_key=authconfig.SECRET_KEY, session_cookie="session_cookie")
    # CsrfProtect.init_app(app, secret=authconfig.CSRF_SECRET_KEY)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        try:
            # Delete all records from each table
            # from sqlalchemy import delete

            # for table in reversed(Base.metadata.sorted_tables):
            #     await conn.execute(delete(table))

            #     await conn.execute(select(1))
            await conn.execute(select(1))
            # logger.info("Database connection established")
        except SQLAlchemyError as e:
            # logger.error(f"Database connection failed: {e}")
            raise HTTPException(status_code=500, detail="Could not connect to the database")

# Include Routers
app.include_router(user_router.router, prefix="/dashboard/users", tags=["users"])
app.include_router(ambulance_router.router, prefix="/dashboard/ambulance", tags=["ambulances"])
app.include_router(account_router.router, prefix="/dashboard/accounts", tags=["accounts"])
app.include_router(hospital_router.router, prefix="/dashboard/hospitals", tags=["hospitals"])
app.include_router(blood_router.router, prefix="/dashboard/blood", tags=["blood"])

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
