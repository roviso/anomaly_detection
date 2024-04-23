from sqlalchemy.orm import Session
from sqlalchemy.future import select
from app.models.user import User as UserModel
from sqlalchemy.ext.asyncio import  AsyncSession
from app.schemas.user import UserCreate, UserUpdate
from app.utils.security import hash_password
from typing import List,Optional
from passlib.context import CryptContext
from google.oauth2 import id_token
from google.auth.transport import requests
from config.db import async_session
from sqlalchemy.exc import SQLAlchemyError

async def get_user_by_registration_token(db: Session, registration_token: str) -> UserModel:
    # return db.query(UserModel).filter(UserModel.registration_token == registration_token).first()
    result = await db.execute(select(UserModel).where(UserModel.registration_token == registration_token))
    return result.scalars().one()


async def get_user_by_email(db: Session, email: str) -> Optional[UserModel]:
    result = await db.execute(select(UserModel).where(UserModel.email == email))
    user = result.scalars().first()  # Retrieve the first user found

    if user:
        return user
    else:
        return None  # Return None if no user is found



async def set_is_google_account(db: Session, user_id: int, is_google_account: bool) -> None:
    db_user = await get_user(db, user_id)
    if db_user:
        setattr(db_user, 'is_active', is_google_account)
        await db.commit()
        await db.refresh(db_user)
    else:
        raise ValueError("User not found")
    



async def extract_user_info_from_google_token(token: str):
    # Define your Google client ID
    CLIENT_ID = '579884707101-g1p3u00e5hth3pel5h1mmui5dt76aol9.apps.googleusercontent.com'

    try:
        # Verify the token using Google's token info endpoint
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

        # Assuming you want to extract email and username from the verified token
        user_info = {
            "email": idinfo.get('email'),
            "username": idinfo.get('email').split('@')[0]  # Using email as username
        }

        return user_info
    except ValueError as e:
        # Token verification failed
        print("Token verification failed:", e)
        return None

async def get_user(db: Session, user_id: int):
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    return result.scalars().one()

async def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[UserModel]:
    result = await db.execute(select(UserModel).offset(skip).limit(limit))
    return result.scalars().all()

# def create_user(db: Session, user: UserCreate):
#     hashed_password = hash_password(user.password)
#     db_user = UserModel(username=user.username, email=user.email, password=hashed_password, registration_token=user.registration_token)
#     # async with db() as session:  # Assuming `db` is an asynchronous session manager
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user


async def create_user(db: AsyncSession, user: UserCreate):
    try:
        hashed_password = hash_password(user.password)
        user = UserModel(username=user.username, email=user.email, password=hashed_password, registration_token=user.registration_token)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
    except SQLAlchemyError as e:
        # Handle exceptions, such as unique constraint violations or database errors
        # You can log the error, rollback the transaction, or raise an appropriate exception
        raise e
    


def create_or_get_google_user(db: Session, user_info: dict):
    # Check if the user already exists
    db_user = db.query(UserModel).filter(UserModel.email == user_info["email"]).first()
    if db_user:
        return db_user  # User exists, return the existing user
    else:
        # Create a new user with the details provided by Google
        db_user = UserModel(
            email=user_info["email"],
            username=user_info.get("username", user_info["email"].split("@")[0]),  # Use email prefix as username
            is_active=True,
            is_google_account=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


async def login_user(db: Session, username: str, password: str):
    stmt = select(UserModel).where(UserModel.username == username)
    result = await db.execute(stmt)
    user = result.scalars().first()
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

async def update_user(db: Session, user_id: int, user: UserUpdate):
    db_user = await get_user(db, user_id)
    if db_user:
        for var, value in vars(user).items():
            setattr(db_user, var, value) if value else None
        await db.commit()
        await db.refresh(db_user)
    return db_user

async def delete_user(db: Session, user_id: int):
    db_user = await get_user(db, user_id)
    if db_user:
        await db.delete(db_user)
        await db.commit()
    return db_user
