from sqlmodel import SQLModel, create_engine, Session
import pathlib
import logging

logger = logging.getLogger(__name__)

# Database file location: backend/data/vendors.db
ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DATA_DIR.mkdir(exist_ok=True)

DATABASE_URL = f"sqlite:///{DATA_DIR}/vendors.db"

# Create engine with check_same_thread=False for SQLite (needed for FastAPI async)
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


def create_db_and_tables():
    """Create all database tables."""
    logger.info("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    logger.info(f"Database initialized at {DATA_DIR}/vendors.db")


def get_session():
    """Dependency to get database session."""
    with Session(engine) as session:
        yield session
