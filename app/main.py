from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app.api import settings, xero

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

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Include routers
app.include_router(settings.router, prefix="/api", tags=["settings"])
app.include_router(xero.router, prefix="/api", tags=["xero"])
# Import and include routers
# from app.api import dext, validation
# app.include_router(dext.router, prefix="/api/dext", tags=["dext"])
# app.include_router(validation.router, prefix="/api/validation", tags=["validation"]) 