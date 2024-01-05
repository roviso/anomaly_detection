from fastapi import APIRouter, Depends, HTTPException, status,Request
from sqlalchemy.orm import Session
from typing import List

from config.db import get_db
from app.services import hospital_service, session_service
from app.schemas.hospital import HospitalCreate, HospitalUpdate, Hospital
from app.utils.security import session_cookie,get_session_id_from_cookie


router = APIRouter()

@router.post("/hospitals/create", response_model=Hospital, status_code=status.HTTP_201_CREATED)
async def create_hospital(hospital: HospitalCreate,request: Request, db: Session = Depends(get_db)):
    try:
        created_hospital =  await hospital_service.create_hospital(db, hospital)
        return created_hospital
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def check_session_validity(session_id: str) -> bool:
    # Implement the logic to check if the session_id is valid
    # This might involve querying your database or session storage
    # Return True if valid, False otherwise
    print(f"_________________{session_id}_________________")
    pass


def verify_session(request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized access")

    # Add your logic here to validate the session_id (e.g., check in a database)
    is_valid = check_session_validity(session_id)
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid session")

    return session_id



@router.get("/gethospitals", response_model=List[Hospital])
async def read_hospitals(request: Request,skip: int = 0, limit: int = 100,session_id: str = Depends(get_session_id_from_cookie), db: Session = Depends(get_db)):
    user_id = session_service.get_user_id_from_session(db, session_id)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    try:
        hospitals = await hospital_service.get_all_hospitals(db, skip=skip, limit=limit)
        return hospitals
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/profile/detail/{hospital_id}", response_model=Hospital)
async def read_hospital(hospital_id: int,request: Request, db: Session = Depends(get_db)):
    try:
        hospital = await hospital_service.get_hospital(db, hospital_id)
        # print("hospital is: ", hospital.__dict__)
        if hospital is None:
            raise HTTPException(status_code=404, detail="Hospital not found")
        return hospital
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/hospitals/{hospital_id}/update", response_model=Hospital)
async def update_hospital(hospital_id: int,request: Request, hospital: HospitalUpdate, db: Session = Depends(get_db)):
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
