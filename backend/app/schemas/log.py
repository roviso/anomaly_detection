from pydantic import BaseModel
from typing import Optional, Dict

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
    cookies: Optional[Dict]
    post_params: Optional[Dict]
    get_params: Optional[Dict]
    body: Optional[Dict]
    response_status: int
    process_time: float
