from sqlalchemy import Column, Integer, String, Float, JSON, Boolean, DateTime, ForeignKey
from config.db import Base
from app.models.common import IDModelMixin, DateTimeModelMixin
from typing import Optional
from sqlalchemy.orm import relationship
from datetime import datetime


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

    # Relationship to link to the anomaly results
    anomaly_results = relationship("AnomalyDetectionResult", back_populates="log", cascade="all, delete-orphan")




class AnomalyDetectionResult(Base):
    __tablename__ = "anomaly_detection_results"

    id = Column(Integer, primary_key=True)
    log_id = Column(Integer, ForeignKey('logs.id'))
    is_anomaly = Column(Boolean)
    model_name = Column(String)
    prediction_date = Column(DateTime, default=datetime.utcnow)

    # Relationship to link back to the HttpRequestLog
    log = relationship("HttpRequestLog", back_populates="anomaly_results")

# # Add a relationship in the HttpRequestLog model to link to the anomaly results
# HttpRequestLog.anomaly_results = relationship("AnomalyDetectionResult", back_populates="log", cascade="all, delete-orphan")