from sqlmodel import SQLModel, create_engine, Session
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Use the centralized pydantic settings (which reads .env via Settings.Config)
DATABASE_URL = settings.database_url

# Create engine and log the resolved URL with password hidden for safety
engine = create_engine(DATABASE_URL, echo=False)
try:
    # SQLAlchemy URL object supports rendering with hidden password
    masked = engine.url.render_as_string(hide_password=True)
except Exception:
    masked = str(DATABASE_URL)

logger.info(f"Using database URL: {masked}")


def get_session():
    """Dependency to get database session."""
    with Session(engine) as session:
        yield session
