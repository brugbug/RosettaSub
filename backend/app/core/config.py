import os
from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv

load_dotenv()   # load .env file into the environment

class Settings(BaseSettings):
    """Application settings"""
    # Basic application info
    PROJECT_NAME: str = "RosettaSub API"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    
    # OpenAI API Key
    OPENAI_API_KEY: str = Field(default="", env="OPENAI_API_KEY") # put openai / other LLM api key here!!!
    
    # Upload settings
    UPLOAD_DIR: str = "uploads"
    
    # Database
    DATABASE_URL: str = Field(default="", env="DATABASE_URL")   # put database url here!!!
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create instance of Settings class that can be imported elsewhere
settings = Settings()

# Create upload directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)