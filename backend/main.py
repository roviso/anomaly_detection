from fastapi import FastAPI, HTTPException,Request,Depends,Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware
from config.settings import authconfig
from config.db import engine, Base, get_db
from app.routes import user_router, ambulance_router, hospital_router, blood_router
from app.services import log_service, session_service
from app.schemas.log import HttpRequestLogSchema
import time
import json
import logging
from logging.handlers import RotatingFileHandler
from starlette.datastructures import FormData  # Corrected import
from starlette.types import ASGIApp, Receive, Scope, Send
# from starlette.requests import Request
from starlette.responses import Response
from app.models.log import HttpRequestLog
from urllib.parse import parse_qs
from ml.utils import extract_log_data, infer_anomaly,get_train_df

class SharedState:
    def __init__(self, one_hot_encoder=None, train_df=None):
        self.one_hot_encoder = one_hot_encoder
        self.train_df = train_df


# Replace these with your actual values
GOOGLE_CLIENT_ID = "579884707101-g1p3u00e5hth3pel5h1mmui5dt76aol9.apps.googleusercontent.com"
CLIENT_SECRETS_FILE = "app/anomaly_detection/backend/config/client_secret_579884707101-g1p3u00e5hth3pel5h1mmui5dt76aol9.apps.googleusercontent.com.json"


# Configure logging
log_file = "logs/log.txt"
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
middleware_log_file = "logs/middleware_log.txt"
middleware_logger = logging.getLogger("middleware_logger")
middleware_logger.setLevel(logging.INFO)
middleware_logger_handler = RotatingFileHandler(middleware_log_file, maxBytes=10000000, backupCount=5)
middleware_logger_handler.setFormatter(logging.Formatter("%(message)s"))
middleware_logger.addHandler(middleware_logger_handler)




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
    async def dispatch(self, request: Request, call_next, db: Session = Depends(get_db)):
        start_time = time.time()

               # Access shared state
        shared_state = request.app.state.shared_state

        # Clone the request for logging purposes
        request_clone = clone_request(request)

                # Extract log data from the request
        # log_data = await extract_log_data(request_clone)
        

        
        # Process the request   
        client_host = request.client.host
        request_time = time.time()
        request_method = request.method
        request_path = request.url.path
        http_version = request.scope["http_version"]
        referrer = request.headers.get("referer", "-")
        user_agent = request.headers.get("user-agent", "-")
        cookies = request.cookies
        # print(request.headers, dir(request.headers))

        # Read and store the request body
        content_type = request.headers.get("content-type", "")

        response = await call_next(request_clone)
        form_data = {}
        log_reponse_message = ''
        print(f"CONTAIN TYPR: {content_type}")
        if "multipart/form-data" in content_type or "application/x-www-form-urlencoded" in content_type:
            form = await request_clone.form()
            form_data = {key: form[key] for key in form}

            
        # Read response body
        response_body = b''
        async for chunk in response.body_iterator:
            response_body += chunk
        log_response_messages = response_body.decode(response.charset)

        # Recreate the response
        new_response = Response(response_body, status_code=response.status_code, media_type=response.media_type, headers=dict(response.headers))


        body = form_data
        response_status = response.status_code

        process_time = (time.time() - start_time) * 1000
        post_params = {}
        # # Log the details
        post_params = await request_clone.form() if request.method == "POST" else {}
        
        # print(555555,post_params)
        get_params = request.query_params

        # if log_message:

        

        # Use asynchronous context manager to manage the database session
        async with get_db() as db:
            if "sessionId" in cookies:
                user_id = await session_service.get_user_id_from_session(db,cookies['sessionId'])
            else:

                user_id = None

            log_data = HttpRequestLogSchema(
                client_host=client_host,
                request_time=request_time,
                request_method=request_method,
                request_path=request_path,
                http_version=http_version,
                referrer=referrer,
                user_agent=user_agent,
                user_id = user_id,
                log_message=log_response_messages,
                cookies=cookies,
                post_params=post_params,  # Add logic to extract POST params
                get_params=get_params,
                body=body,  # Add logic to extract body
                response_status=response_status,
                process_time=process_time
            )
            print("_____WRITING LOG_________")
            log_entry = await log_service.create_http_request_log(db,log_data)
            print(f"Log entry Written to db: {log_entry.__dict__}")


            log_message = (
            f'{client_host} {request_time} "{request_method} {request_path} HTTP/{http_version}" '
            f'{response_status} {process_time}ms "{referrer}" "{user_agent}" "{user_id}"'
            f'{log_response_messages} {json.dumps(cookies)} {json.dumps(dict(post_params))} {json.dumps(dict(get_params))} {json.dumps(body)}'
            )
            middleware_logger.info(log_message)
            # Manually create a database session
            
            #         # Check if the log data is anomalous
            # is_anomalous = infer_anomaly("models/IsolationForest_model.pkl",shared_state.one_hot_encoder, shared_state.train_df,log_data.__dict__)
            # print("Result for anomaly detection: ",is_anomalous )
            # if is_anomalous:
            #     # Handle anomalous request (log, alert, block, etc.)
            #     # For demonstration, we'll just return a simple response
            #     return Response(content="Anomalous activity detected", status_code=403)
            
            
        return new_response



# Usage
# data = asyncio.run(fetch_data())
# Instead of asyncio.run(fetch_data()), directly await the coroutine

    




class AnomalyDetectionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        print("Performing Anomaly detecion")
        # Access shared state
        shared_state = request.app.state.shared_state

        # Clone the request for anomaly detection purposes
        request_clone = clone_request(request)
        
        # Extract log data from the request
        log_data = await extract_log_data(request_clone)
        
        # Check if the log data is anomalous
        is_anomalous = infer_anomaly("models/IsolationForest_model.pkl",shared_state.one_hot_encoder, shared_state.train_df,log_data)
        print("Result for anomaly detection: ",is_anomalous )
        if is_anomalous:
            # Handle anomalous request (log, alert, block, etc.)
            # For demonstration, we'll just return a simple response
            return Response(content="Anomalous activity detected", status_code=403)
        
        # If not anomalous, or if you decide to let it through, proceed with the request
        # response = await call_next(request)
        # return response
    

# Initialize the FastAPI app
app = FastAPI()


origins = [
        # "*",
            "http://127.0.0.1:3000",
           "http://localhost:3000"]


app.add_middleware(CustomLoggingMiddleware)

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


# Add the Anomaly Detection Middleware to your FastAPI application
# app.add_middleware(AnomalyDetectionMiddleware)

# # # Wrap the FastAPI app with CustomASGIApp
# async def load_logs_to_db(file_path: str):
#     with open(file_path, 'r') as file:
#         async with get_db() as db:
#             for line in file:
#                 log_data = get_log_data(line)
#                 if log_data:
#                     log_entry = HttpRequestLog(**log_data)
#                     db.add(log_entry)
#             await db.commit()


@app.on_event("startup")
async def startup_event():
    # app.add_middleware(SessionMiddleware, secret_key=authconfig.SECRET_KEY, session_cookie="session_cookie")
    # CsrfProtect.init_app(app, secret=authconfig.CSRF_SECRET_KEY)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        try:
            one_hot_encoder, train_df = await get_train_df()
            app.state.shared_state = SharedState(one_hot_encoder, train_df)
            # Delete all records from each table
            # from sqlalchemy import delete
            # await conn.run_sync(HttpRequestLog.__table__.drop)

            # for table in reversed(Base.metadata.sorted_tables):
            #     await conn.execute(delete(table))

            # #     await conn.execute(select(1))
            # await conn.execute(select(1))
            # async with get_db() as db:
            #     data = await fetch_data(db)
            #     train_df = get_train_df(data)
            # Example logs
            # await load_logs_to_db('logs/non_anomaly.txt')

            # logger.info("Database connection established")
        except SQLAlchemyError as e:
            # logger.error(f"Database connection failed: {e}")
            raise HTTPException(status_code=500, detail="Could not connect to the database")

# Include Routers
app.include_router(user_router.router, prefix="/dashboard/users", tags=["users"])
app.include_router(ambulance_router.router, prefix="/dashboard/ambulance", tags=["ambulances"])
# app.include_router(account_router.router, prefix="/dashboard/accounts", tags=["accounts"])
app.include_router(hospital_router.router, prefix="/dashboard/hospitals", tags=["hospitals"])
app.include_router(blood_router.router, prefix="/dashboard/blood", tags=["blood"])

@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

