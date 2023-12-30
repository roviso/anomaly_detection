from sqlalchemy import Column, Integer, String, Boolean, DateTime
from config.db import Base
from app.models.common import IDModelMixin,DateTimeModelMixin

class Account(Base, IDModelMixin, DateTimeModelMixin):
    __tablename__ = "accounts"
    
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean(), default=True)
