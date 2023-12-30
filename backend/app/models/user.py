from sqlalchemy import Column, Integer, String, Boolean, DateTime
from config.db import Base
from app.models.common import IDModelMixin,DateTimeModelMixin


class User(Base, IDModelMixin, DateTimeModelMixin):
    __tablename__ = "users"
    
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_active = Column(Boolean(), default=True)
