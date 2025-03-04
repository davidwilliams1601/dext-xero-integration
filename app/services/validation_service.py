from typing import Dict, List, Optional
import openai
from app.core.config import settings
from app.models.invoice import Invoice, InvoiceStatus

class ValidationService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY

    async def validate_invoice(self, invoice: Invoice) -> Dict:
        """
        Validate invoice data using AI
        """
        validation_result = {
            "is_valid": False,
            "confidence_score": 0.0,
            "errors": [],
            "suggestions": []
        }

        try:
            # Validate VAT number format
            vat_validation = self._validate_vat_number(invoice.vat_number)
            if not vat_validation["is_valid"]:
                validation_result["errors"].append(vat_validation["error"])
            else:
                validation_result["confidence_score"] += 0.3

            # Validate VAT code using AI
            vat_code_validation = await self._validate_vat_code(invoice.vat_code)
            if not vat_code_validation["is_valid"]:
                validation_result["errors"].append(vat_code_validation["error"])
            else:
                validation_result["confidence_score"] += 0.4

            # Validate amount format
            amount_validation = self._validate_amount(invoice.amount)
            if not amount_validation["is_valid"]:
                validation_result["errors"].append(amount_validation["error"])
            else:
                validation_result["confidence_score"] += 0.3

            # Update validation result
            validation_result["is_valid"] = (
                validation_result["confidence_score"] >= settings.MIN_CONFIDENCE_SCORE
                and not validation_result["errors"]
            )

            return validation_result

        except Exception as e:
            validation_result["errors"].append(f"Validation error: {str(e)}")
            return validation_result

    def _validate_vat_number(self, vat_number: str) -> Dict:
        """
        Validate VAT number format
        """
        if not vat_number:
            return {"is_valid": False, "error": "VAT number is missing"}

        # Basic VAT number validation (example for UK VAT numbers)
        if not vat_number.startswith("GB"):
            return {"is_valid": False, "error": "Invalid VAT number format"}

        return {"is_valid": True}

    async def _validate_vat_code(self, vat_code: str) -> Dict:
        """
        Validate VAT code using AI
        """
        if not vat_code:
            return {"is_valid": False, "error": "VAT code is missing"}

        try:
            # Use OpenAI to validate and categorize VAT code
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a VAT code validation expert."},
                    {"role": "user", "content": f"Validate and categorize this VAT code: {vat_code}"}
                ]
            )

            # Process the AI response
            # This is a simplified example - you would need to implement proper response parsing
            return {"is_valid": True}

        except Exception as e:
            return {"is_valid": False, "error": f"AI validation error: {str(e)}"}

    def _validate_amount(self, amount: float) -> Dict:
        """
        Validate invoice amount
        """
        if amount <= 0:
            return {"is_valid": False, "error": "Invalid amount"}

        return {"is_valid": True} 