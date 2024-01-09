from sqlalchemy.orm import Session
from sqlalchemy.future import select
from app.models.log import HttpRequestLog
from app.schemas.log import HttpRequestLogSchema
from typing import List

async def create_http_request_log(db: Session, log_data: HttpRequestLogSchema):
    log_entry = HttpRequestLog(**log_data.dict())
    db.add(log_entry)
    await db.commit()
    await db.refresh(log_entry)
    return log_entry

async def get_all_logs(db: Session, skip: int = 0, limit: int = 100) -> List[HttpRequestLog]:
    result = await db.execute(select(HttpRequestLog).offset(skip).limit(limit))
    return result.scalars().all()
