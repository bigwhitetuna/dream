from sqlalchemy import MetaData, BigInteger, Column, Integer, String, ForeignKey, DateTime, select, create_engine, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from ..base import Base

class Dream(Base):
    __tablename__ = 'dreams'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.id'))
    prompt = Column(String)
    negative_prompt = Column(String)
    imagination = Column(Integer)
    style = Column(String)
    image_url = Column(String)
    timestamp = Column(DateTime, default=func.now())