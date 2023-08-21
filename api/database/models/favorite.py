from sqlalchemy import MetaData, BigInteger, Column, Integer, ForeignKey, DateTime, select, create_engine, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from ..base import Base

class Favorite(Base):
    __tablename__ = 'favorites'

    id = Column(Integer, primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.id'))
    dream_id = Column(Integer, ForeignKey('dreams.id'))
    created_at = Column(DateTime, default=func.now())