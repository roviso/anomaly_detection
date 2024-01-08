from pydantic import BaseModel, constr
from datetime import datetime
from typing import Optional, List
from app.schemas.common import IDModelMixin, DateTimeModelMixin
from app.schemas.ambulance import Ambulance
from app.schemas.blood import Blood

class HospitalBase(BaseModel):
    name: constr(min_length=3, max_length=100)
    address: str
    opening_hour: str
    closing_hour: str
    contact_number: str
    alternative_contact_number: str
    hospital_type: str
    province: int
    district: int
    total_beds: int
    total_icu_beds: int
    total_ventilators: int
    total_isolation_beds: int
    available_icu_beds: int
    available_ventilators: int
    available_isolation_beds: int
    oxygen_support_available: bool
    available_blood: bool

    class Config:
        orm_mode = True

class HospitalCreate(HospitalBase):
    pass

class HospitalUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    opening_hour: Optional[str] = None
    closing_hour: Optional[str] = None
    contact_number: Optional[str] = None
    alternative_contact_number: Optional[str] = None
    hospital_type: Optional[str] = None
    province: Optional[int] = None
    district: Optional[int] = None
    total_beds: Optional[int] = None
    total_icu_beds: Optional[int] = None
    total_ventilators: Optional[int] = None
    total_isolation_beds: Optional[int] = None
    available_icu_beds: Optional[int] = None
    available_ventilators: Optional[int] = None
    available_isolation_beds: Optional[int] = None
    oxygen_support_available: Optional[bool] = None
    available_blood: Optional[bool] = None

class HospitalInDBBase(HospitalBase, IDModelMixin, DateTimeModelMixin):
    ambulances: List[Ambulance] = []
    blood_samples: List[Blood] = []  # Assuming Blood schema is defined

class Hospital(HospitalInDBBase):
    pass
