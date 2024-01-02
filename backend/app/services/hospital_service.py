from sqlalchemy.orm import Session,joinedload
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.hospital import Hospital as HospitalModel
from app.schemas.hospital import HospitalCreate, HospitalUpdate
from fastapi import Depends
from config.db import get_db
import anyio



async def create_hospital(db: Session, hospital_data: HospitalCreate):
    print(hospital_data)
    # new_hospital = HospitalModel(name=hospital_data.name, address=hospital_data.address, available_ventilators= hospital_data.available_ventilators,available_isolation_beds= hospital_data.available_isolation_beds,oxygen_support_available= hospital_data.oxygen_support_available)
    new_hospital = HospitalModel(**hospital_data.dict())
    print("_______11111____________")
    db.add(new_hospital)
    print("_______12222221111____________")
    await db.commit()
    print("_______1111333331____________")
    await db.refresh(new_hospital)
    print("_______11eee5111____________")
    return new_hospital
# from sqlalchemy.ext.asyncio import AsyncSession

# async def create_hospital(db: AsyncSession, hospital_data: HospitalCreate):
#     print(hospital_data)
#     new_hospital = HospitalModel(**hospital_data.dict())

#     async with anyio.create_task_group() as tg:
#         tg.start_soon(add_hospital, db, new_hospital)
    
#     return new_hospital

# async def add_hospital(db: AsyncSession, new_hospital: HospitalModel):
#     async with db.begin():
#         db.add(new_hospital)
#         await db.flush()
#     await db.refresh(new_hospital)




async def get_hospital(db: Session, hospital_id: int) -> HospitalModel:
    try:
        # result = await db.execute(select(HospitalModel).where(HospitalModel.id == hospital_id))
        # Eager loading the relationships using options
        result = await db.execute(select(HospitalModel).options(joinedload("ambulances"), joinedload("blood_samples")).where(HospitalModel.id == hospital_id))
        
        # Applying the unique() method to handle joined eager loads
        return result.unique().scalars().one()
    except NoResultFound:
        return None

async def get_all_hospitals(db: Session, skip: int = 0, limit: int = 100) -> List[HospitalModel]:
    # Eager loading the relationships using options
    result = await db.execute(select(HospitalModel).options(joinedload("ambulances"), joinedload("blood_samples")).offset(skip).limit(limit))
    
    # Applying the unique() method to handle joined eager loads
    return result.unique().scalars().all()

async def update_hospital(db: Session, hospital_id: int, hospital: HospitalUpdate) -> HospitalModel:
    db_hospital = await get_hospital(db, hospital_id)
    if db_hospital:
        update_data = hospital.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_hospital, key, value)
        await db.commit()
        await db.refresh(db_hospital)
        return db_hospital
    return None

async def delete_hospital(db: Session, hospital_id: int) -> bool:
    db_hospital = await get_hospital(db, hospital_id)
    if db_hospital:
        await db.delete(db_hospital)
        await db.commit()
        return True
    return False