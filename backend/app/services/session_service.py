# session_utils.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.session import Session as SessionModel
from uuid import uuid4
from datetime import datetime, timedelta
from sqlalchemy import delete, select

async def create_session(db: AsyncSession, user_id: int) -> str:
    session_id = str(uuid4())
    db_session = SessionModel(session_id=session_id, user_id=user_id)
    db.add(db_session)
    await db.commit()
    await db.refresh(db_session)
    return session_id

async def get_user_id_from_session(db: AsyncSession, session_id: str) -> int:
    result = await db.execute(select(SessionModel).filter(SessionModel.session_id == session_id))
    session = result.scalars().first()
    if session and not await is_session_expired(session):
        return session.user_id
    return None

async def is_session_expired(session: SessionModel) -> bool:
    # Define your logic for session expiration
    # Example: Session expires after 24 hours
    return datetime.utcnow() > session.created_at + timedelta(hours=24)

async def delete_session(db: AsyncSession, session_id: str):
    await db.execute(delete(SessionModel).where(SessionModel.session_id == session_id))
    await db.commit()
