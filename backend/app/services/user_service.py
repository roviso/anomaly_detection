from sqlalchemy.orm import Session
from sqlalchemy.future import select
from app.models.user import User as UserModel
from app.schemas.user import UserCreate, UserUpdate
from app.utils.security import hash_password
from typing import List
from passlib.context import CryptContext


async def get_user(db: Session, user_id: int):
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    return result.scalars().one()

async def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[UserModel]:
    result = await db.execute(select(UserModel).offset(skip).limit(limit))
    return result.scalars().all()

async def create_user(db: Session, user: UserCreate):
    hashed_password = hash_password(user.password)
    db_user = UserModel(username=user.username, email=user.email, password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
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
