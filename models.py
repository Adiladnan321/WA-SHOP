from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()
engine = create_engine('sqlite:///whatsapp_logs.db')

class MessageLog(Base):
    __tablename__ = 'message_logs'
    
    id = Column(Integer, primary_key=True)
    phone = Column(String)
    template_name = Column(String)
    status = Column(String)
    error_details = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
Base.metadata.create_all(engine)
