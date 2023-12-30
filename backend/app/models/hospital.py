from sqlalchemy import Column, Integer, String, Boolean, DateTime
from config.db import Base
from app.models.common import IDModelMixin,DateTimeModelMixin
from sqlalchemy.orm import relationship


class Hospital(Base, IDModelMixin, DateTimeModelMixin):
    __tablename__ = "hospitals"
    
    name = Column(String, index=True)
    address = Column(String)

    ambulances = relationship("Ambulance", back_populates="hospital")
    blood_samples = relationship("Blood", back_populates="hospital")
