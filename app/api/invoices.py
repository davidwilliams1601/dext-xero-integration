from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.models.invoice import Invoice, InvoiceStatus
from app.services.dext_service import DextService
from app.services.validation_service import ValidationService
from app.services.xero_service import XeroService

router = APIRouter()
dext_service = DextService()
validation_service = ValidationService()
xero_service = XeroService()

@router.get("/invoices", response_model=List[Invoice])
async def get_invoices(
    status: InvoiceStatus = None,
    start_date: datetime = None,
    end_date: datetime = None,
    db: Session = Depends(get_db)
):
    """
    Get all invoices with optional filtering
    """
    query = db.query(Invoice)
    
    if status:
        query = query.filter(Invoice.status == status)
    if start_date:
        query = query.filter(Invoice.date >= start_date)
    if end_date:
        query = query.filter(Invoice.date <= end_date)
        
    return query.all()

@router.post("/invoices/sync")
async def sync_invoices(db: Session = Depends(get_db)):
    """
    Sync invoices from Dext
    """
    try:
        # Fetch invoices from Dext
        invoices_data = await dext_service.fetch_invoices()
        
        for invoice_data in invoices_data:
            # Process invoice data
            invoice = dext_service.process_invoice(invoice_data)
            
            # Check if invoice already exists
            existing_invoice = db.query(Invoice).filter(
                Invoice.dext_id == invoice.dext_id
            ).first()
            
            if existing_invoice:
                continue
                
            # Validate invoice
            validation_result = await validation_service.validate_invoice(invoice)
            invoice.confidence_score = validation_result["confidence_score"]
            
            if validation_result["is_valid"]:
                invoice.status = InvoiceStatus.VALIDATED
                
                # Push to Xero
                xero_result = await xero_service.push_invoice(invoice)
                if xero_result["success"]:
                    invoice.xero_invoice_id = xero_result["xero_invoice_id"]
                    invoice.status = InvoiceStatus.PUSHED_TO_XERO
                else:
                    invoice.status = InvoiceStatus.ERROR
                    invoice.validation_errors = {"xero_error": xero_result["error"]}
            else:
                invoice.status = InvoiceStatus.ERROR
                invoice.validation_errors = validation_result["errors"]
            
            db.add(invoice)
        
        db.commit()
        return {"message": "Invoice sync completed successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/invoices/{invoice_id}", response_model=Invoice)
async def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """
    Get a specific invoice by ID
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.post("/invoices/{invoice_id}/validate")
async def validate_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """
    Manually trigger validation for a specific invoice
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    validation_result = await validation_service.validate_invoice(invoice)
    invoice.confidence_score = validation_result["confidence_score"]
    
    if validation_result["is_valid"]:
        invoice.status = InvoiceStatus.VALIDATED
    else:
        invoice.status = InvoiceStatus.ERROR
        invoice.validation_errors = validation_result["errors"]
    
    db.commit()
    return validation_result

@router.post("/invoices/{invoice_id}/push-to-xero")
async def push_to_xero(invoice_id: int, db: Session = Depends(get_db)):
    """
    Manually push a validated invoice to Xero
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    if invoice.status != InvoiceStatus.VALIDATED:
        raise HTTPException(status_code=400, detail="Invoice must be validated first")
        
    xero_result = await xero_service.push_invoice(invoice)
    if xero_result["success"]:
        invoice.xero_invoice_id = xero_result["xero_invoice_id"]
        invoice.status = InvoiceStatus.PUSHED_TO_XERO
    else:
        invoice.status = InvoiceStatus.ERROR
        invoice.validation_errors = {"xero_error": xero_result["error"]}
    
    db.commit()
    return xero_result 