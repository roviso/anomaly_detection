from pydantic import BaseModel

class BloodBase(BaseModel):
    blood_type: str
    is_available: bool
    details: str

class BloodCreate(BloodBase):
    pass

class Blood(BloodBase):
    id: int
    hospital_id: int

    class Config:
        orm_mode = True
