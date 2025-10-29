from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
import os

# Load .env file from the backend directory
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)

class Settings(BaseSettings):
    """Application settings with Jumpseller API configuration."""
    
    # Jumpseller API credentials - will be loaded from .env
    jumpseller_login: str = "your_store_login_here"
    jumpseller_auth_token: str = "your_auth_token_here"
    jumpseller_api_base_url: str = "https://api.jumpseller.com/v1"
    jumpseller_api_timeout: int = 30
    
    # FastAPI settings
    app_name: str = "Vendor Application Backend"
    debug: bool = False
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        # This ensures environment variables are read
        env_prefix = ""

# Global settings instance
settings = Settings()