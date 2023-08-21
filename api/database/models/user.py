from sqlalchemy import MetaData, BigInteger, Column, Integer, String, ForeignKey, DateTime, select, create_engine, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from ..base import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    discord_user_id = Column(BigInteger)
    discord_nickname = Column(String)
    discord_avatar = Column(String)
    # reference to dreams table
    dreams = relationship('Dream', backref='user')