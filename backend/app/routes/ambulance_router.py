from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from config.db import get_db
from app.services import ambulance_service
from app.schemas.ambulance import AmbulanceCreate, AmbulanceUpdate, Ambulance
from app.utils.security import validate_session_id
from fastapi_csrf_protect import CsrfProtect
  # Assuming you have these functions



csrf_protect = CsrfProtect()


router = APIRouter()

@router.post("/details/create", response_model=Ambulance, status_code=status.HTTP_201_CREATED)
async def create_ambulance(
    ambulance: AmbulanceCreate, 
    db: Session = Depends(get_db),
    user_id: str = Depends(validate_session_id),
    csrf_token: str = Depends(csrf_protect.validate_csrf)
):
    try:
        return await ambulance_service.create_ambulance(db, ambulance)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/getambulance", response_model=List[Ambulance])
async def read_ambulances(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    user_id: str = Depends(validate_session_id)
):
    try:
        return await ambulance_service.get_all_ambulances(db, skip=skip, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/details/{ambulance_id}", response_model=Ambulance)
async def read_ambulance(
    ambulance_id: int, 
    db: Session = Depends(get_db),
    user_id: str = Depends(validate_session_id)
):
    try:
        ambulance = await ambulance_service.get_ambulance(db, ambulance_id)
        if ambulance is None:
            raise HTTPException(status_code=404, detail="Ambulance not found")
        return ambulance
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/details/{ambulance_id}/update", response_model=Ambulance)
async def update_ambulance(
    ambulance_id: int, 
    ambulance: AmbulanceUpdate, 
    db: Session = Depends(get_db),
    user_id: str = Depends(validate_session_id),
    csrf_token: str = Depends(csrf_protect.validate_csrf)
):
    try:
        updated_ambulance = await ambulance_service.update_ambulance(db, ambulance_id, ambulance)
        if updated_ambulance is None:
                        raise HTTPException(status_code=404, detail="Ambulance not found")
        return updated_ambulance
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{ambulance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ambulance(
    ambulance_id: int, 
    db: Session = Depends(get_db),
    user_id: str = Depends(validate_session_id),
    csrf_token: str = Depends(csrf_protect.validate_csrf)
):
    try:
        success = await ambulance_service.delete_ambulance(db, ambulance_id)
        if not success:
            raise HTTPException(status_code=404, detail="Ambulance not found")
        return {"message": "Ambulance successfully deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

