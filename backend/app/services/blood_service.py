from sqlalchemy.orm import Session
from app.models.blood import Blood as BloodModel
from app.schemas.blood import BloodCreate
from sqlalchemy.future import select
from typing import List

async def create_blood(db: Session, blood: BloodCreate) -> BloodModel:
    db_blood = BloodModel(**blood.dict())
    db.add(db_blood)
    await db.commit()
    await db.refresh(db_blood)
    return db_blood

async def get_bloods(db: Session, skip: int = 0, limit: int = 100) -> List[BloodModel]:
    return db.execute(select(BloodModel).offset(skip).limit(limit)).scalars().all()

# Add other CRUD operations as necessary
