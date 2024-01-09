from sqlalchemy import Column, Integer, String, Float, JSON
from config.db import Base
from app.models.common import IDModelMixin, DateTimeModelMixin
from typing import Optional

class HttpRequestLog(Base, IDModelMixin, DateTimeModelMixin):
    __tablename__ = "logs"

    client_host = Column(String)
    request_time = Column(Float)
    request_method = Column(String)
    request_path = Column(String)
    http_version = Column(String)
    referrer = Column(String, nullable=True)
    user_agent = Column(String)
    user_id = Column(Integer, nullable=True)  # User ID can be nullable
    log_message=  Column(String, nullable=True)
    cookies = Column(JSON, nullable=True)
    post_params = Column(JSON, nullable=True)
    get_params = Column(JSON, nullable=True)
    body = Column(JSON, nullable=True)
    response_status = Column(Integer)
    process_time = Column(Float)