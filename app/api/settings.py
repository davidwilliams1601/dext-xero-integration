from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.settings import Settings
from pydantic import BaseModel
import json

router = APIRouter()

class SettingsUpdate(BaseModel):
    dextApiKey: Optional[str] = None
    xeroClientId: Optional[str] = None
    xeroClientSecret: Optional[str] = None
    openaiApiKey: Optional[str] = None
    googleCloudVisionCredentials: Optional[str] = None

def get_settings(db: Session) -> Settings:
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.get("/settings")
async def read_settings(db: Session = Depends(get_db)):
    settings = get_settings(db)
    return {
        "dextApiKey": settings.dext_api_key,
        "xeroClientId": settings.xero_client_id,
        "xeroClientSecret": settings.xero_client_secret,
        "openaiApiKey": settings.openai_api_key,
        "googleCloudVisionCredentials": settings.google_cloud_vision_credentials,
    }

@router.post("/settings")
async def update_settings(
    settings_update: SettingsUpdate,
    db: Session = Depends(get_db)
):
    settings = get_settings(db)
    
    if settings_update.dextApiKey is not None:
        settings.dext_api_key = settings_update.dextApiKey
    if settings_update.xeroClientId is not None:
        settings.xero_client_id = settings_update.xeroClientId
    if settings_update.xeroClientSecret is not None:
        settings.xero_client_secret = settings_update.xeroClientSecret
    if settings_update.openaiApiKey is not None:
        settings.openai_api_key = settings_update.openaiApiKey
    if settings_update.googleCloudVisionCredentials is not None:
        try:
            credentials = json.loads(settings_update.googleCloudVisionCredentials)
            settings.google_cloud_vision_credentials = credentials
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=400,
                detail="Invalid Google Cloud Vision credentials JSON format"
            )
    
    db.commit()
    db.refresh(settings)
    return {"message": "Settings updated successfully"} 