from sqlmodel import SQLModel, create_engine, Session
import logging
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/vendors_db"
)

engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables():
    """Create all database tables."""
    logger.info("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    logger.info("Database initialized")


def get_session():
    """Dependency to get database session."""
    with Session(engine) as session:
        yield session
