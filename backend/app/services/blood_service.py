from sqlalchemy.orm import Session
from sqlalchemy.future import select
from app.models.blood import Blood as BloodModel
from app.schemas.blood import BloodCreate, BloodUpdate
from typing import List

async def get_all_blood_samples(db: Session, skip: int = 0, limit: int = 100) -> List[BloodModel]:
    result = await db.execute(select(BloodModel).offset(skip).limit(limit))
    return result.scalars().all()

async def get_blood_sample(db: Session, blood_id: int):
    result = await db.execute(select(BloodModel).where(BloodModel.id == blood_id))
    blood_sample = result.scalars().first()
    return blood_sample

async def create_blood_sample(db: Session, blood_sample: BloodCreate):
    db_blood_sample = BloodModel(**blood_sample.dict())
    db.add(db_blood_sample)
    await db.commit()
    await db.refresh(db_blood_sample)
    return db_blood_sample

async def update_blood_sample(db: Session, blood_id: int, blood_sample: BloodUpdate):
    db_blood_sample = await get_blood_sample(db, blood_id)
    if db_blood_sample:
        for var, value in vars(blood_sample).items():
            setattr(db_blood_sample, var, value) if value else None
        await db.commit()
        await db.refresh(db_blood_sample)
    return db_blood_sample

async def delete_blood_sample(db: Session, blood_id: int):
    db_blood_sample = await get_blood_sample(db, blood_id)
    if db_blood_sample:
        await db.delete(db_blood_sample)
        await db.commit()
    return db_blood_sample
