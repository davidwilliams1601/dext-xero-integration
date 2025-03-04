from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app.api import settings, xero
from app.core.init_db import init_db
from app.core.security import rate_limit_middleware, verify_api_key

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Dext to Xero Integration",
    description="API for processing invoices from Dext to Xero",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # React development server
        "https://dext-xero-frontend.onrender.com",  # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware
app.middleware("http")(rate_limit_middleware)

@app.on_event("startup")
async def startup_event():
    # Initialize database tables
    init_db()

# Health check endpoint (no auth required)
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Include routers with authentication
app.include_router(
    settings.router,
    prefix="/api",
    tags=["settings"],
    dependencies=[verify_api_key]
)
app.include_router(
    xero.router,
    prefix="/api",
    tags=["xero"],
    dependencies=[verify_api_key]
)

# Import and include routers
# from app.api import dext, validation
# app.include_router(dext.router, prefix="/api/dext", tags=["dext"])
# app.include_router(validation.router, prefix="/api/validation", tags=["validation"]) 