from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from config.db import Base
from sqlalchemy.orm import relationship
from app.models.common import IDModelMixin,DateTimeModelMixin

class Blood(Base, IDModelMixin, DateTimeModelMixin):
    __tablename__ = 'blood'

    blood_type = Column(String, index=True)
    is_available = Column(Boolean, default=True)
    details = Column(String)

    hospital_id = Column(Integer, ForeignKey('hospitals.id'))
    hospital = relationship("Hospital", back_populates="blood_samples")
