"""
Configuration Management
Loads settings from environment variables
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application Info
    APP_NAME: str = "BookMind AI"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # OpenAI Configuration
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    EMBEDDING_MODEL: str = "text-embedding-ada-002"
    MAX_TOKENS: int = 2000
    TEMPERATURE: float = 0.7
    
    # File Upload Settings
    MAX_FILE_SIZE: int = 10485760  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "txt"]
    UPLOAD_DIR: str = "uploads"
    
    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]
    
    # AI Processing Settings
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    MAX_CONTEXT_LENGTH: int = 4000
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()


# Validate critical settings on import
def validate_settings():
    """Validate critical configuration settings"""
    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "your_openai_api_key_here":
        raise ValueError(
            "⚠️  OPENAI_API_KEY not set! Please set it in your .env file.\n"
            "Get your API key from: https://platform.openai.com/api-keys"
        )
    
    # Create upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


# Run validation
validate_settings()
