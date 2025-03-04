from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    dext_api_key = Column(String, nullable=True)
    xero_client_id = Column(String, nullable=True)
    xero_client_secret = Column(String, nullable=True)
    xero_access_token = Column(String, nullable=True)
    xero_refresh_token = Column(String, nullable=True)
    xero_token_expires_at = Column(String, nullable=True)
    openai_api_key = Column(String, nullable=True)
    google_cloud_vision_credentials = Column(JSON, nullable=True) 