from sqlalchemy import Column, Integer, String, Boolean, DateTime
from config.db import Base
from app.models.common import IDModelMixin,DateTimeModelMixin
from sqlalchemy.orm import relationship


class Hospital(Base, IDModelMixin, DateTimeModelMixin):
    __tablename__ = "hospitals"
    
    name = Column(String, index=True)
    address = Column(String)
    opening_hour = Column(String)
    closing_hour = Column(String)
    contact_number = Column(String)
    alternative_contact_number = Column(String)
    hospital_type = Column(String)
    province = Column(Integer)
    district = Column(Integer)
    total_beds = Column(Integer)
    total_icu_beds = Column(Integer)
    total_ventilators = Column(Integer)
    total_isolation_beds = Column(Integer)
    available_icu_beds = Column(Integer)
    available_ventilators = Column(Integer)
    available_isolation_beds = Column(Integer)
    oxygen_support_available = Column(Boolean)
    available_blood = Column(Boolean)

    ambulances = relationship("Ambulance", back_populates="hospital", lazy='selectin')
    blood_samples = relationship("Blood", back_populates="hospital", lazy='selectin')




