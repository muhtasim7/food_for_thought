from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """Application configuration settings loaded from environment variables"""
    
    # Database
    database_url: str = "postgresql://food_user:food_password@localhost:5432/food_for_thought"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Supabase (optional)
    supabase_project_id: Optional[str] = None
    supabase_url: Optional[str] = None
    supabase_secret_api_key: Optional[str] = None
    supabase_publishable_key: Optional[str] = None
    supabase_jwt_alg: str = "ES256"
    supabase_jwt_kty: str = "EC"
    supabase_jwt_crv: str = "P-256"
    supabase_jwt_kid: Optional[str] = None
    supabase_jwt_x: Optional[str] = None
    supabase_jwt_y: Optional[str] = None
    
    # CORS (comma-separated in .env)
    cors_origins: str = (
        "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,"
        "https://foodforthought-q3vjnauuq-muhtasim7s-projects.vercel.app"
    )
    cors_origin_regex: Optional[str] = r"https://.*\.vercel\.app"
    
    # App info
    app_name: str = "Food For Thought"
    api_version: str = "v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse comma-separated CORS origins from environment and merge safe defaults."""
        configured_origins = [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
        default_origins = [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "https://foodforthought-q3vjnauuq-muhtasim7s-projects.vercel.app",
        ]

        merged_origins: List[str] = []
        for origin in [*configured_origins, *default_origins]:
            if origin not in merged_origins:
                merged_origins.append(origin)

        return merged_origins


settings = Settings()
