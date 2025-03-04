from sqlalchemy.orm import Session
from app.core.database import engine, Base
from app.models.invoice import Invoice

def init_db():
    """
    Initialize the database
    """
    # Create all tables
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    print("Creating database tables...")
    init_db()
    print("Database tables created successfully!") 