from pydantic import BaseModel, EmailStr, constr
from datetime import datetime
from app.schemas.common import IDModelMixin, DateTimeModelMixin

class AmbulanceBase(BaseModel):
    license_plate: constr(min_length=5, max_length=10)
    hospital_id: int

    class Config:
        orm_mode = True

class AmbulanceCreate(AmbulanceBase):
    service_active: bool

class AmbulanceUpdate(AmbulanceBase):
    service_active: bool = None

class AmbulanceInDBBase(AmbulanceBase, IDModelMixin, DateTimeModelMixin):
    class Config:
        orm_mode = True

class Ambulance(AmbulanceInDBBase):
    pass
