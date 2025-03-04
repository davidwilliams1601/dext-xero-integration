# Dext to Xero Integration

This project automates the process of extracting invoices from Dext, validating them, and pushing them to Xero. It includes AI-powered validation and a dashboard for manual review.

## Features

- Fetch invoices from Dext API
- AI-powered invoice validation and categorization
- Automated push to Xero Bills/Purchases
- Dashboard for manual review and approval
- Comprehensive logging and error handling

## Tech Stack

- Backend: Python FastAPI
- Frontend: React (planned)
- AI Processing: OpenAI Vision API / Google Cloud Vision
- Database: PostgreSQL
- Hosting: Vercel (planned)

## Setup Instructions

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file with the following variables:
   ```
   DEXT_API_KEY=your_dext_api_key
   XERO_CLIENT_ID=your_xero_client_id
   XERO_CLIENT_SECRET=your_xero_client_secret
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_CLOUD_VISION_CREDENTIALS=path_to_credentials.json
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   ```
5. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Project Structure

```
.
├── app/
│   ├── api/            # API endpoints
│   ├── core/           # Core functionality
│   ├── models/         # Database models
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── tests/              # Test files
├── frontend/           # React frontend (planned)
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Development Status

Currently in MVP development phase. See the development plan for more details.

## License

MIT License 