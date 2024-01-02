from pydantic import BaseModel, EmailStr, constr
from datetime import datetime
from app.schemas.common import IDModelMixin, DateTimeModelMixin
from app.schemas.ambulance import Ambulance
from app.schemas.blood import Blood
from typing import List


class HospitalBase(BaseModel):
    name: constr(min_length=3, max_length=100)
    available_icu_beds: int = 0
    available_ventilators: int = 0
    available_isolation_beds: int = 0
    oxygen_support_available: bool = True

    class Config:
        orm_mode = True


class HospitalCreate(HospitalBase):
    address: str

class HospitalUpdate(HospitalBase):
    address: str = None

class HospitalInDBBase(HospitalCreate, IDModelMixin, DateTimeModelMixin):
    ambulances: List[Ambulance] = []
    blood_samples: List[Blood] = []  # Assuming Blood schema is defined

    class Config:
        orm_mode = True

class Hospital(HospitalInDBBase):
    pass
