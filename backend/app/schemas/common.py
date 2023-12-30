from pydantic import BaseModel, EmailStr, constr
from datetime import datetime
from typing import Optional

class IDModelMixin(BaseModel):
    id: int

class DateTimeModelMixin(BaseModel):
    created_at:  Optional[datetime] = None
    updated_at:  Optional[datetime] = None
