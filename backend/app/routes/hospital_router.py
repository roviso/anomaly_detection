from fastapi import APIRouter, Depends, HTTPException, status,Request,Form
from sqlalchemy.orm import Session
from typing import List
from fastapi_csrf_protect import CsrfProtect

from config.db import get_db
from app.services import hospital_service, session_service
from app.schemas.hospital import HospitalCreate, HospitalUpdate, Hospital
from app.utils.security import session_cookie,validate_session_id



csrf_protect = CsrfProtect()


router = APIRouter()

@router.get("/gethospitals", response_model=List[Hospital])
async def read_hospitals(request: Request,skip: int = 0, limit: int = 100,user_id: str = Depends(validate_session_id), db: Session = Depends(get_db)):
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    try:
        hospitals = await hospital_service.get_all_hospitals(db, skip=skip, limit=limit)
        return hospitals
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    


@router.post("/hospitals/create", response_model=Hospital, status_code=status.HTTP_201_CREATED)
async def create_hospital(
    request: Request,
    name: str = Form(...), 
    address: str = Form(None),
    opening_hour: str = Form(None),
    closing_hour: str = Form(None),
    contact_number: str = Form(None),
    alternative_contact_number: str = Form(None),
    hospital_type: str = Form(None),
    province: int = Form(0),
    district: int = Form(0),
    total_beds: int = Form(0),
    total_icu_beds: int = Form(0),
    total_ventilators: int = Form(0),
    total_isolation_beds: int = Form(0),
    available_icu_beds: int = Form(0),
    available_ventilators: int = Form(0),
    available_isolation_beds: int = Form(0),
    oxygen_support_available: bool = Form(False),
    available_blood: bool = Form(False),
    db: Session = Depends(get_db), 
    user_id: str = Depends(validate_session_id), 
    csrf_token: str = Depends(csrf_protect.validate_csrf)   
):
    hospital_data = HospitalCreate(
        name=name, 
        address=address,
        opening_hour=opening_hour,
        closing_hour=closing_hour,
        contact_number=contact_number,
        alternative_contact_number=alternative_contact_number,
        hospital_type=hospital_type,
        province=province,
        district=district,
        total_beds=total_beds,
        total_icu_beds=total_icu_beds,
        total_ventilators=total_ventilators,
        total_isolation_beds=total_isolation_beds,
        available_icu_beds=available_icu_beds,
        available_ventilators=available_ventilators,
        available_isolation_beds=available_isolation_beds,
        oxygen_support_available=oxygen_support_available,
        available_blood=available_blood
    )
    created_hospital = await hospital_service.create_hospital(db, hospital_data)
    return created_hospital


    # try:
    # created_hospital = await hospital_service.create_hospital(db, hospital_data)
    # return created_hospital
    # # except Exception as e:
    # #     raise HTTPException(status_code=400, detail=str(e))





@router.get("/profile/detail/{hospital_id}", response_model=Hospital)
async def read_hospital(
        hospital_id: int, 
        request: Request, 
        db: Session = Depends(get_db), 
        user_id: str = Depends(validate_session_id)
    ):
    try:
        hospital = await hospital_service.get_hospital(db, hospital_id)
        # print("hospital is: ", hospital.__dict__)
        if hospital is None:
            raise HTTPException(status_code=404, detail="Hospital not found")
        return hospital
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/hospitals/{hospital_id}/update", response_model=Hospital)
async def update_hospital(
    request: Request, 
    hospital_id: int, 
    name: str = Form(None), 
    address: str = Form(None),
    opening_hour: str = Form(None),
    closing_hour: str = Form(None),
    contact_number: str = Form(None),
    alternative_contact_number: str = Form(None),
    hospital_type: str = Form(None),
    province: int = Form(None),
    district: int = Form(None),
    total_beds: int = Form(None),
    total_icu_beds: int = Form(None),
    total_ventilators: int = Form(None),
    total_isolation_beds: int = Form(None),
    available_icu_beds: int = Form(None),
    available_ventilators: int = Form(None),
    available_isolation_beds: int = Form(None),
    oxygen_support_available: bool = Form(None),
    available_blood: bool = Form(None),
    db: Session = Depends(get_db), 
    user_id: str = Depends(validate_session_id), 
    csrf_token: str = Depends(csrf_protect.validate_csrf)
):
    hospital_data = HospitalUpdate(
        name=name, 
        address=address,
        opening_hour=opening_hour,
        closing_hour=closing_hour,
        contact_number=contact_number,
        alternative_contact_number=alternative_contact_number,
        hospital_type=hospital_type,
        province=province,
        district=district,
        total_beds=total_beds,
        total_icu_beds=total_icu_beds,
        total_ventilators=total_ventilators,
        total_isolation_beds=total_isolation_beds,
        available_icu_beds=available_icu_beds,
        available_ventilators=available_ventilators,
        available_isolation_beds=available_isolation_beds,
        oxygen_support_available=oxygen_support_available,
        available_blood=available_blood
    )
    updated_hospital = await hospital_service.update_hospital(db, hospital_id, hospital_data)
    if updated_hospital is None:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return updated_hospital

@router.delete("/hospitals/{hospital_id}/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hospital(
        hospital_id: int, 
        db: Session = Depends(get_db), 
        user_id: str = Depends(validate_session_id), 
        csrf_token: str = Depends(csrf_protect.validate_csrf)
    ):
    try:
        success = await hospital_service.delete_hospital(db, hospital_id)
        if not success:
            raise HTTPException(status_code=404, detail="Hospital not found")
        return {"message": "Hospital successfully deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
