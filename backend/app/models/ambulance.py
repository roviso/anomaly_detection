from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from config.db import Base
from app.models.common import IDModelMixin,DateTimeModelMixin

class Ambulance(Base, IDModelMixin, DateTimeModelMixin):
    __tablename__ = "ambulances"
    
    license_plate = Column(String, unique=True, index=True)
    service_active = Column(Boolean(), default=True)

    hospital_id = Column(Integer, ForeignKey('hospitals.id'))
    hospital = relationship("Hospital", back_populates="ambulances")
