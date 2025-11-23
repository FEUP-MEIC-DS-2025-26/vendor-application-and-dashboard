from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
import os

# Load .env file from the backend directory
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)

class Settings(BaseSettings):
    # Google Application Credentials for GCP
    google_application_credentials: str = ""

    # Custom URLs from .env
    add_product_page_url: str = ""
    frontend_url: str = ""

    # Google Cloud Pub/Sub settings
    gcp_project_id: str = ""
    gcp_pubsub_topic: str = ""

    """Application settings with Jumpseller API configuration."""

    # Jumpseller API credentials - will be loaded from .env
    jumpseller_login: str = "your_store_login_here"
    jumpseller_auth_token: str = "your_auth_token_here"
    jumpseller_api_base_url: str = "https://api.jumpseller.com/v1"
    jumpseller_api_timeout: int = 30

    # Sentry Telemetry
    sentry_dsn: Optional[str] = None
    
    # --- CORREÇÃO ADICIONADA ---
    # Database URL (usa um ficheiro sqlite local como fallback)
    database_url: str = "sqlite:///./temp.db"
    # ---------------------------

    # FastAPI settings
    app_name: str = "Vendor Application Backend"
    debug: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        env_prefix = ""

# Global settings instance
settings = Settings()