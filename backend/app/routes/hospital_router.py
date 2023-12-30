from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from config.db import get_db
from app.services import hospital_service
from app.schemas.hospital import HospitalCreate, HospitalUpdate, Hospital

router = APIRouter()

@router.post("/hospitals/create", response_model=Hospital, status_code=status.HTTP_201_CREATED)
async def create_hospital(hospital: HospitalCreate, db: Session = Depends(get_db)):
    try:
        created_hospital =  await hospital_service.create_hospital(db, hospital)
        return created_hospital
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/gethospitals", response_model=List[Hospital])
async def read_hospitals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        return await hospital_service.get_all_hospitals(db, skip=skip, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/profile/detail/{hospital_id}", response_model=Hospital)
async def read_hospital(hospital_id: int, db: Session = Depends(get_db)):
    try:
        hospital = await hospital_service.get_hospital(db, hospital_id)
        if hospital is None:
            raise HTTPException(status_code=404, detail="Hospital not found")
        return hospital
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/hospitals/{hospital_id}/update", response_model=Hospital)
async def update_hospital(hospital_id: int, hospital: HospitalUpdate, db: Session = Depends(get_db)):
    try:
        updated_hospital = await hospital_service.update_hospital(db, hospital_id, hospital)
        if updated_hospital is None:
            raise HTTPException(status_code=404, detail="Hospital not found")
        return updated_hospital
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/hospitals/{hospital_id}/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hospital(hospital_id: int, db: Session = Depends(get_db)):
    try:
        success = await hospital_service.delete_hospital(db, hospital_id)
        if not success:
            raise HTTPException(status_code=404, detail="Hospital not found")
        return {"message": "Hospital successfully deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
