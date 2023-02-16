from sqlalchemy import Integer, String, Column, Boolean
from sqlalchemy.orm import relationship

from app.database.base_class import Base


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(256), nullable=True)
    last_name = Column(String(256), nullable=True)
    email = Column(String, index=True, nullable=False)
    is_superuser = Column(Boolean, default=False)
    recipes = relationship(
        "WeatherData",
        cascade="all,delete-orphan",
        back_populates="submitter",
        uselist=True,
    )
