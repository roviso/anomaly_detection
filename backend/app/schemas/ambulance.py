from pydantic import BaseModel
from datetime import datetime
from app.schemas.common import IDModelMixin, DateTimeModelMixin


class AmbulanceBase(BaseModel):
    driver_name: str
    contact_number: str
    alternative_contact_number: str
    status: str

class AmbulanceCreate(AmbulanceBase):
    hospital_id: int  # Assuming hospital_id is required for creating an ambulance

class AmbulanceUpdate(AmbulanceBase):
    driver_name: str = None
    contact_number: str = None
    alternative_contact_number: str = None
    status: str = None
    hospital_id: int = None

class AmbulanceInDBBase(AmbulanceBase, IDModelMixin, DateTimeModelMixin):
    class Config:
        orm_mode = True

class Ambulance(AmbulanceInDBBase):
    pass

class AmbulanceInDB(AmbulanceInDBBase):
    pass
