from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class InvoiceStatus(enum.Enum):
    PENDING = "pending"
    VALIDATED = "validated"
    PUSHED_TO_XERO = "pushed_to_xero"
    ERROR = "error"

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    dext_id = Column(String, unique=True, index=True)
    supplier_name = Column(String)
    vat_number = Column(String)
    vat_code = Column(String)
    amount = Column(Float)
    date = Column(DateTime)
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.PENDING)
    confidence_score = Column(Float)
    validation_errors = Column(JSON, nullable=True)
    xero_invoice_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Invoice {self.dext_id} - {self.supplier_name}>" 