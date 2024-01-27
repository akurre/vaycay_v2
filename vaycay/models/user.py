from sqlalchemy import Integer, String, Column, Boolean
from sqlalchemy.orm import relationship

from vaycay.db.base_class import Base


class User(Base):
    date = Column(String, primary_key=True, index=True)
    first_name = Column(String(256), nullable=True)
    last_name = Column(String(256), nullable=True)
    email = Column(String, nullable=False)
    is_superuser = Column(Boolean, default=False)
    # weather_data_all = relationship(
    #     "date",
    #     cascade="all,delete-orphan",
    #     # back_populates="submitter",
    #     uselist=True,
    # )
