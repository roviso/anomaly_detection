from sqlalchemy import Column, Integer, String, Boolean, DateTime
from config.db import Base
from app.models.common import IDModelMixin,DateTimeModelMixin
from sqlalchemy.orm import relationship


class Hospital(Base, IDModelMixin, DateTimeModelMixin):
    __tablename__ = "hospitals"
    
    name = Column(String, index=True)
    address = Column(String)
    available_icu_beds = Column(Integer)
    available_ventilators = Column(Integer)
    available_isolation_beds = Column(Integer)
    oxygen_support_available = Column(Boolean)

    ambulances = relationship("Ambulance", back_populates="hospital", lazy='selectin')
    blood_samples = relationship("Blood", back_populates="hospital", lazy='selectin')
