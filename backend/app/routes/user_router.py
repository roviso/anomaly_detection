from fastapi import APIRouter, Depends, HTTPException, status, Form, Request, Response
from sqlalchemy.orm import Session
from typing import List
from typing_extensions import Annotated
from config.db import get_db
from app.services import user_service, session_service, email_service
from app.schemas.user import UserCreate, UserUpdate, User
from app.schemas.token import CsrfConfig
from pydantic import BaseModel, EmailStr, constr
from fastapi_csrf_protect.exceptions import MissingTokenError
from fastapi_csrf_protect import CsrfProtect

from config.settings import authconfig
from uuid import uuid4
from app.utils.security import get_session_id_from_cookie, validate_session_id


csrf_protect = CsrfProtect()


@csrf_protect.load_config
def get_csrf_config():
    return CsrfConfig(secret_key=authconfig.CSRF_SECRET_KEY, max_age=3600)

router = APIRouter()

class LoginSchema:
    def __init__(self, username: str = Form(...), password: str = Form(...)):
        self.username = username
        self.password = password

# Create a serializer instance for encoding/decoding token


@router.get("/csrf_token", response_model=str)
async def get_csrf_token(response: Response):
    token, signed_token = csrf_protect.generate_csrf(secret_key=authconfig.CSRF_SECRET_KEY)
    # Set the CSRF token as a cookie in the response
    response.set_cookie(
        key="fastapi-csrf-token",
        value=signed_token,
        httponly=True,  # Recommended to prevent access via JavaScript
        samesite="None",
           # Important for cross-origin requests
        secure=True  # Recommended, send only over HTTPS
    )
    return token




@router.post("/register")
async def register_user(request: Request, db: Session = Depends(get_db)):
    print("_____________Registering_____________")
    
    # try:
    data = await request.json()  # Extract data from the request body

    print(f"user_data: {data}")
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    async with get_db() as db:
        user = await user_service.get_user_by_email(db, email)

        if user and user.is_active:
            return {"message": "User Already Registered"}
        elif user and not user.is_active:
            registration_link = f"http://localhost:3000/email-confirmation/{user.registration_token}"

        else:
            # Generate unique registration token (You can use UUID or any other method)
            registration_token = email_service.generate_unique_token()
            # Create user with registration_token and is_google_account=False
            user_data = UserCreate(
                email=email,
                username=username,
                password=password,
                registration_token=registration_token
            )


            created_user = await user_service.create_user(db, user_data)
            print(created_user.__dict__,55555555555555555)

            # Send registration email with the unique registration link
            registration_link = f"http://localhost:3000/email-confirmation/{registration_token}"
    email_service.send_registration_email(email, registration_link)

    

    return {"message": "Registration email sent successfully"}
    # except Exception as e:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/register-confirmation/{registration_token}")
async def complete_registration(registration_token: str, db: Session = Depends(get_db)):
    print("confirming the email...")
    # Verify the registration token and complete the registration process

    async with get_db() as db:
        user = await user_service.get_user_by_registration_token(db, registration_token)
        if user:
            # Update user's is_google_account to True
            await user_service.set_is_google_account(db, user.id, True)
            return {"message": "Registration completed successfully"}
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid registration token")
    



@router.post("/google-auth", response_model=User)
async def google_auth_route(
    request: Request,
    db: Session = Depends(get_db)
):
    # Assuming you have a way to identify if the request is from Google Auth
    # For example, a special token or parameter in the request
    if "token" not in request.json():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token not provided")
    
    token = request.json()["token"]

    # Assuming you have a service method to validate and extract user info from the token
    user_info = user_service.extract_user_info_from_google_token(token)

    if user_info is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # Assuming you have a service method to create or get the user based on the user info
    created_or_found_user = user_service.create_or_get_google_user(db, user_info)

    return created_or_found_user


@router.post("/login", response_model= User )
async def login(response: Response, request: Request, username: str = Form(...), password: str= Form(...) , db: Session = Depends(get_db)):

    print(request.headers,username,password,9999999)
    try:
        await csrf_protect.validate_csrf(request=request)
    except MissingTokenError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing or invalid CSRF token")
    
    print("CSRF VALIDATED SUCCESSFULLY")
    async with get_db() as db:
        authenticated_user = await user_service.login_user(db, username, password)
        if not authenticated_user:
            # print("WRITING MESSAGE: {________}")
            # message = "Invalid username or password"
            # response.headers["Log-Message"] = message

            raise HTTPException(status_code=401, detail="Invalid username or password")

        session_id = await session_service.create_session(db,authenticated_user.id)

        response.set_cookie(
            key="sessionId",  # Name of the cookie
            value=session_id,  # Value of the cookie
            httponly=True,     # Recommended to prevent access via JavaScript
            samesite="None",   # Important for cross-origin requests, use "Lax" for same-site requests
            secure=True        # Recommended, send only over HTTPS
        )

        
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        # Return a simple response indicating success
        # return {"message": "Login successful"}
        return authenticated_user



@router.post("/logout")
async def logout(response: Response, db: Session = Depends(get_db), session_id: str = Depends(get_session_id_from_cookie)):
    async with get_db() as db:
        await session_service.delete_session(db, session_id)
        response.delete_cookie(key="sessionId")
        return {"message": "Logged out"}



@router.get("/get_user", response_model=List[User])
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user_id: int = Depends(validate_session_id)):
    try:
        async with get_db() as db:
            users = await user_service.get_all_users(db, skip=skip, limit=limit)
            return users
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/detail/{user_id}", response_model=User)
async def read_user_detail( user_id: int = Depends(validate_session_id), db: Session = Depends(get_db)):
    async with get_db() as db:
        user = await user_service.get_user(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

# @router.post("/create", response_model=User, status_code=status.HTTP_201_CREATED)
# async def create_user(
#         email: EmailStr = Form(...),
#         username: constr(min_length=3, max_length=50) = Form(...), 
#         password: constr(min_length=6, max_length=50) = Form(...),
#         db: Session = Depends(get_db), 
#         csrf_token: str = Depends(csrf_protect.validate_csrf)
#     ):
#     user_data = UserCreate(email=email, is_active=True, username=username, password=password)    
#     try:
#         async with get_db() as db:
#             created_user = await user_service.create_user(db, user_data)
#             return created_user
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))

@router.post("/create", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user_route(
    request: Request,
    db: Session = Depends(get_db)
):
    print("Creating User...")
    try:
        data = await request.json()  # Extract data from the request body
        token = data.get("token")  # Get the token from the request body
        print(f'the data: {data}')

        print(f'the token: {token}')
        if token:
            # Extract user information from the token
            user_info = user_service.extract_user_info_from_google_token(token)
            if user_info:
                # Create or get the user based on the extracted user info
                created_or_found_user = user_service.create_or_get_google_user(db, user_info)
                return created_or_found_user
            else:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        else:
            # Regular sign-up process
            user_data = UserCreate(
                email=data["email"],
                username=data["username"],
                password=data["password"]
            )
            created_user = await user_service.create_user(db, user_data)
            return created_user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Similarly, update other routes
@router.put("/{user_id}/update", response_model=User)
async def update_user(email: EmailStr = Form(...),username: constr(min_length=3, max_length=50) = Form(...), db: Session = Depends(get_db), csrf_token: str = Depends(csrf_protect.validate_csrf), user_id: int = Depends(validate_session_id)):
    user: UserUpdate = UserUpdate(email = email,username = username)
    try:
        async with get_db() as db:
            updated_user = await user_service.update_user(db, user_id, user)
            if updated_user is None:
                raise HTTPException(status_code=404, detail="User not found")
            return updated_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{user_id}/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db), csrf_token: str = Depends(csrf_protect.validate_csrf), session_user_id: int = Depends(validate_session_id)):
    try:
        async with get_db() as db:
            success = await user_service.delete_user(db, user_id)
            if not success:
                raise HTTPException(status_code=404, detail="User not found")
            return {"message": "User successfully deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))