from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from config.db import get_db
from app.services import blood_service
from app.schemas.blood import BloodCreate, BloodUpdate, Blood

router = APIRouter()

@router.post("/details/create", response_model=Blood, status_code=status.HTTP_201_CREATED)
async def create_blood(blood: BloodCreate, db: Session = Depends(get_db)):
    try:
        return await blood_service.create_blood_sample(db, blood)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/getblood", response_model=List[Blood])
async def read_blood_samples(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        return await blood_service.get_all_blood_samples(db, skip=skip, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/details/{blood_id}", response_model=Blood)
async def read_blood_sample(blood_id: int, db: Session = Depends(get_db)):
    try:
        blood_sample = await blood_service.get_blood_sample(db, blood_id)
        if blood_sample is None:
            raise HTTPException(status_code=404, detail="Blood sample not found")
        return blood_sample
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/details/{blood_id}/update", response_model=Blood)
async def update_blood_sample(blood_id: int, blood_sample: BloodUpdate, db: Session = Depends(get_db)):
    try:
        updated_blood_sample = await blood_service.update_blood_sample(db, blood_id, blood_sample)
        if updated_blood_sample is None:
            raise HTTPException(status_code=404, detail="Blood sample not found")
        return updated_blood_sample
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{blood_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blood_sample(blood_id: int, db: Session = Depends(get_db)):
    try:
        success = await blood_service.delete_blood_sample(db, blood_id)
        if not success:
            raise HTTPException(status_code=404, detail="Blood sample not found")
        return {"message": "Blood sample successfully deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
