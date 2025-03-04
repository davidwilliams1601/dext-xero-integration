from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.settings import Settings
import requests
from datetime import datetime, timedelta
import json

router = APIRouter()

XERO_AUTH_URL = "https://login.xero.com/identity/connect/authorize"
XERO_TOKEN_URL = "https://identity.xero.com/connect/token"
XERO_SCOPE = "offline_access accounting.transactions accounting.contacts"

def get_settings(db: Session) -> Settings:
    settings = db.query(Settings).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

@router.get("/xero/auth-url")
async def get_xero_auth_url(db: Session = Depends(get_db)):
    settings = get_settings(db)
    
    if not settings.xero_client_id:
        raise HTTPException(
            status_code=400,
            detail="Xero Client ID not configured"
        )
    
    # Generate state parameter for security
    state = "xero_auth_state"  # In production, use a secure random string
    
    # Build authorization URL
    auth_url = (
        f"{XERO_AUTH_URL}?"
        f"response_type=code&"
        f"client_id={settings.xero_client_id}&"
        f"redirect_uri=http://localhost:5173/xero/callback&"
        f"scope={XERO_SCOPE}&"
        f"state={state}"
    )
    
    return {"authUrl": auth_url}

@router.post("/xero/callback")
async def handle_xero_callback(
    code: str,
    db: Session = Depends(get_db)
):
    settings = get_settings(db)
    
    if not settings.xero_client_id or not settings.xero_client_secret:
        raise HTTPException(
            status_code=400,
            detail="Xero credentials not configured"
        )
    
    try:
        # Exchange code for tokens
        token_response = requests.post(
            XERO_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": "http://localhost:5173/xero/callback",
                "client_id": settings.xero_client_id,
                "client_secret": settings.xero_client_secret,
            }
        )
        token_response.raise_for_status()
        token_data = token_response.json()
        
        # Update settings with tokens
        settings.xero_access_token = token_data["access_token"]
        settings.xero_refresh_token = token_data["refresh_token"]
        settings.xero_token_expires_at = (
            datetime.now() + timedelta(seconds=token_data["expires_in"])
        ).isoformat()
        
        db.commit()
        return {"message": "Xero authentication successful"}
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to exchange code for tokens: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/xero/refresh-token")
async def refresh_xero_token(db: Session = Depends(get_db)):
    settings = get_settings(db)
    
    if not settings.xero_client_id or not settings.xero_client_secret or not settings.xero_refresh_token:
        raise HTTPException(
            status_code=400,
            detail="Xero credentials not configured"
        )
    
    try:
        # Check if token needs refresh
        if settings.xero_token_expires_at:
            expires_at = datetime.fromisoformat(settings.xero_token_expires_at)
            if datetime.now() < expires_at:
                return {"message": "Token still valid"}
        
        # Refresh token
        token_response = requests.post(
            XERO_TOKEN_URL,
            data={
                "grant_type": "refresh_token",
                "refresh_token": settings.xero_refresh_token,
                "client_id": settings.xero_client_id,
                "client_secret": settings.xero_client_secret,
            }
        )
        token_response.raise_for_status()
        token_data = token_response.json()
        
        # Update settings with new tokens
        settings.xero_access_token = token_data["access_token"]
        if "refresh_token" in token_data:
            settings.xero_refresh_token = token_data["refresh_token"]
        settings.xero_token_expires_at = (
            datetime.now() + timedelta(seconds=token_data["expires_in"])
        ).isoformat()
        
        db.commit()
        return {"message": "Token refreshed successfully"}
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to refresh token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        ) 