from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Keys
    DEXT_API_KEY: str = os.getenv("DEXT_API_KEY", "")
    XERO_CLIENT_ID: str = os.getenv("XERO_CLIENT_ID", "")
    XERO_CLIENT_SECRET: str = os.getenv("XERO_CLIENT_SECRET", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/dbname")
    
    # Google Cloud Vision
    GOOGLE_CLOUD_VISION_CREDENTIALS: Optional[str] = os.getenv("GOOGLE_CLOUD_VISION_CREDENTIALS")
    
    # Application Settings
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Dext to Xero Integration"
    
    # Validation Settings
    MIN_CONFIDENCE_SCORE: float = 0.90
    
    class Config:
        case_sensitive = True

settings = Settings() 