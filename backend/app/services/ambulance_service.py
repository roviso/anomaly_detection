from sqlalchemy.orm import Session
from sqlalchemy.future import select
from app.models.ambulance import Ambulance as AmbulanceModel
from app.schemas.ambulance import AmbulanceCreate, AmbulanceUpdate
from typing import List

async def get_all_ambulances(db: Session, skip: int = 0, limit: int = 100) -> List[AmbulanceModel]:
    result = await db.execute(select(AmbulanceModel).offset(skip).limit(limit))
    return result.scalars().all()


async def get_ambulance(db: Session, ambulance_id: int):
    result = await db.execute(select(AmbulanceModel).where(AmbulanceModel.id == ambulance_id))
    ambulance = result.scalars().first()
    return ambulance

async def create_ambulance(db: Session, ambulance: AmbulanceCreate):
    db_ambulance = AmbulanceModel(**ambulance.dict())
    db.add(db_ambulance)
    await db.commit()
    await db.refresh(db_ambulance)
    return db_ambulance

async def update_ambulance(db: Session, ambulance_id: int, ambulance: AmbulanceUpdate):
    db_ambulance = await get_ambulance(db, ambulance_id)
    if db_ambulance:
        for var, value in vars(ambulance).items():
            setattr(db_ambulance, var, value) if value else None
        await db.commit()
        await db.refresh(db_ambulance)
    return db_ambulance

async def delete_ambulance(db: Session, ambulance_id: int):
    db_ambulance = await get_ambulance(db, ambulance_id)
    if db_ambulance:
        await db.delete(db_ambulance)
        await db.commit()
    return db_ambulance
