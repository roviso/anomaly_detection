from pydantic import BaseModel, EmailStr, constr
from datetime import datetime
from app.schemas.common import IDModelMixin, DateTimeModelMixin


class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = False

class UserCreate(UserBase):
    username: constr(min_length=3, max_length=50)
    password: constr(min_length=6, max_length=50)
    registration_token: str

class UserUpdate(UserBase):
    username: constr(min_length=3, max_length=50) = None
    password: constr(min_length=6, max_length=50) = None

class UserInDBBase(UserBase, IDModelMixin, DateTimeModelMixin):
    username: constr(min_length=3, max_length=50)

    class Config:
        orm_mode = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str
