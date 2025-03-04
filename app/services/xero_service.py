import requests
from typing import Dict, Optional
from datetime import datetime, timedelta
from app.core.config import settings
from app.models.invoice import Invoice, InvoiceStatus

class XeroService:
    def __init__(self):
        self.client_id = settings.XERO_CLIENT_ID
        self.client_secret = settings.XERO_CLIENT_SECRET
        self.base_url = "https://api.xero.com/api.xro/2.0"  # Replace with actual Xero API URL
        self.access_token = None
        self.token_expires_at = None

    async def authenticate(self):
        """
        Authenticate with Xero API
        """
        try:
            # Implement OAuth2 authentication flow
            # This is a placeholder - you would need to implement the actual OAuth2 flow
            self.access_token = "dummy_token"
            self.token_expires_at = datetime.now() + timedelta(hours=1)
        except Exception as e:
            print(f"Authentication error: {str(e)}")
            raise

    async def push_invoice(self, invoice: Invoice) -> Dict:
        """
        Push invoice to Xero
        """
        try:
            if not self.access_token or datetime.now() >= self.token_expires_at:
                await self.authenticate()

            # Prepare invoice data for Xero
            xero_invoice = self._prepare_xero_invoice(invoice)

            # Send invoice to Xero
            response = requests.post(
                f"{self.base_url}/Invoices",
                headers={
                    "Authorization": f"Bearer {self.access_token}",
                    "Content-Type": "application/json"
                },
                json=xero_invoice
            )
            response.raise_for_status()

            xero_response = response.json()
            return {
                "success": True,
                "xero_invoice_id": xero_response["InvoiceID"]
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def _prepare_xero_invoice(self, invoice: Invoice) -> Dict:
        """
        Prepare invoice data for Xero format
        """
        return {
            "Type": "ACCPAY",
            "Contact": {
                "Name": invoice.supplier_name
            },
            "LineItems": [
                {
                    "Description": "Invoice from Dext",
                    "Quantity": 1,
                    "UnitAmount": invoice.amount,
                    "AccountCode": "200"  # Replace with appropriate account code
                }
            ],
            "Date": invoice.date.strftime("%Y-%m-%d"),
            "DueDate": (invoice.date + timedelta(days=30)).strftime("%Y-%m-%d"),
            "Reference": f"DEXT-{invoice.dext_id}",
            "Status": "AUTHORISED"
        }

    async def verify_bank_transaction(self, invoice: Invoice) -> bool:
        """
        Verify if there's a matching bank transaction in Xero
        """
        try:
            if not self.access_token or datetime.now() >= self.token_expires_at:
                await self.authenticate()

            # Search for matching bank transaction
            response = requests.get(
                f"{self.base_url}/BankTransactions",
                headers={
                    "Authorization": f"Bearer {self.access_token}",
                    "Content-Type": "application/json"
                },
                params={
                    "where": f"Reference==DEXT-{invoice.dext_id}"
                }
            )
            response.raise_for_status()

            transactions = response.json().get("BankTransactions", [])
            return len(transactions) > 0

        except Exception as e:
            print(f"Bank transaction verification error: {str(e)}")
            return False 