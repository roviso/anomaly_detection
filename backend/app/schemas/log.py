from pydantic import BaseModel
from typing import Optional, Dict

from datetime import datetime
class HttpRequestLogSchema(BaseModel):
    client_host: str
    request_time: float
    request_method: str
    request_path: str
    http_version: str
    referrer: Optional[str]
    user_agent: str
    user_id: Optional[int] # User ID can be nullable
    log_message:  Optional[str]
    cookies: Dict
    post_params: Dict
    get_params: Dict
    body: Dict
    response_status: int
    process_time: float


class AnomalyDetectionResultSchema(BaseModel):
    log_id: int
    is_anomaly: bool
    model_name: str
    prediction_date: Optional[datetime] = None

    class Config:
        orm_mode = True