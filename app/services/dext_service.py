import requests
from typing import List, Dict, Optional
from datetime import datetime
from app.core.config import settings
from app.models.invoice import Invoice, InvoiceStatus

class DextService:
    def __init__(self):
        self.api_key = settings.DEXT_API_KEY
        self.base_url = "https://api.dext.com/v1"  # Replace with actual Dext API URL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def fetch_invoices(self, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> List[Dict]:
        """
        Fetch invoices from Dext API
        """
        try:
            params = {}
            if start_date:
                params["start_date"] = start_date.isoformat()
            if end_date:
                params["end_date"] = end_date.isoformat()

            response = requests.get(
                f"{self.base_url}/invoices",
                headers=self.headers,
                params=params
            )
            response.raise_for_status()
            
            return response.json()["invoices"]
        except requests.exceptions.RequestException as e:
            # Log the error
            print(f"Error fetching invoices from Dext: {str(e)}")
            return []

    def process_invoice(self, invoice_data: Dict) -> Invoice:
        """
        Process raw invoice data into an Invoice model
        """
        try:
            return Invoice(
                dext_id=invoice_data["id"],
                supplier_name=invoice_data["supplier_name"],
                vat_number=invoice_data.get("vat_number"),
                vat_code=invoice_data.get("vat_code"),
                amount=float(invoice_data["amount"]),
                date=datetime.fromisoformat(invoice_data["date"]),
                status=InvoiceStatus.PENDING,
                confidence_score=0.0  # Will be updated during validation
            )
        except (KeyError, ValueError) as e:
            # Log the error
            print(f"Error processing invoice data: {str(e)}")
            raise

    async def get_invoice_details(self, invoice_id: str) -> Optional[Dict]:
        """
        Fetch detailed information for a specific invoice
        """
        try:
            response = requests.get(
                f"{self.base_url}/invoices/{invoice_id}",
                headers=self.headers
            )
            response.raise_for_status()
            
            return response.json()
        except requests.exceptions.RequestException as e:
            # Log the error
            print(f"Error fetching invoice details from Dext: {str(e)}")
            return None 