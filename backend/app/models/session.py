# models.py
from sqlalchemy import Column, Integer, String, DateTime
from config.db import Base  # Import your SQLAlchemy base here
from datetime import datetime

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    user_id = Column(Integer)  # or String, depending on your user ID type
    created_at = Column(DateTime, default=datetime.utcnow)
    # Add more fields as needed, e.g., expiration time, user agent, IP, etc.
