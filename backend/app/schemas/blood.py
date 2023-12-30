from pydantic import BaseModel
from typing import Optional
from app.schemas.common import IDModelMixin, DateTimeModelMixin


class BloodBase(BaseModel):
    blood_type: str
    details: str
    hospital_id: int

    class Config:
        orm_mode = True


class BloodCreate(BloodBase):
    is_available: bool

class BloodUpdate(BloodBase):
    is_available: bool


class BloodInDBBase(BloodBase, IDModelMixin, DateTimeModelMixin):
    class Config:
        orm_mode = True

class Blood(BloodBase):
    pass