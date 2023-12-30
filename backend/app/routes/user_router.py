from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import List
from typing_extensions import Annotated
from config.db import get_db
from app.services import user_service
from app.schemas.user import UserCreate, UserUpdate, User
from pydantic import BaseModel

router = APIRouter()

class LoginSchema(BaseModel):
    username: str
    password: str


@router.post("/login", response_model= User)
async def login(user: LoginSchema, db: Session = Depends(get_db)):
    try:
        users = await user_service.login_user(db, user.username, user.password)
        return users
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/get_user", response_model=List[User])
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        users = await user_service.get_all_users(db, skip=skip, limit=limit)
        return users
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/create", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        created_user = await user_service.create_user(db, user)
        return created_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/detail/{user_id}", response_model=User)
async def read_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = await user_service.get_user(db, user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/{user_id}/status")
async def status_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = await user_service.get_user(db, user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        if user.is_active:
            return {
                "status": "Active"
            }
        else:
            return {
                "status": "InActive"
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{user_id}/update", response_model=User)
async def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    try:
        updated_user = await user_service.update_user(db, user_id, user)
        if updated_user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{user_id}/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    try:
        success = await user_service.delete_user(db, user_id)
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "User successfully deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))