import os
from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.engine import URL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings


def build_database_url():
    """Build DB URL from POSTGRES_* vars when available, otherwise use DATABASE_URL."""
    user = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    host = os.getenv("POSTGRES_HOST")
    database = os.getenv("POSTGRES_DB")

    if user and password and host and database:
        port = int(os.getenv("POSTGRES_PORT", "5432"))
        sslmode = os.getenv("POSTGRES_SSLMODE", "require")
        return URL.create(
            drivername="postgresql+psycopg2",
            username=user,
            password=password,
            host=host,
            port=port,
            database=database,
            query={"sslmode": sslmode},
        )

    return settings.database_url

# Create database engine
database_url = build_database_url()
database_url_str = str(database_url)

connect_args = {"check_same_thread": False} if "sqlite" in database_url_str else {"connect_timeout": 10}

engine = create_engine(
    database_url,
    echo=False,  # Set to True for SQL debugging
    connect_args=connect_args
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()


def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def run_runtime_migrations() -> None:
    """Apply lightweight schema updates for environments without Alembic.

    This keeps existing Supabase tables compatible with the app's current models.
    """
    if "postgresql" not in database_url_str:
        return

    statements = [
        "ALTER TABLE chefs ALTER COLUMN user_id DROP NOT NULL",
        "ALTER TABLE chefs ADD COLUMN IF NOT EXISTS contact_name VARCHAR",
        "ALTER TABLE chefs ADD COLUMN IF NOT EXISTS contact_phone VARCHAR",
        "ALTER TABLE chefs ADD COLUMN IF NOT EXISTS primary_cuisine VARCHAR",
        "ALTER TABLE chefs ADD COLUMN IF NOT EXISTS sample_menu TEXT",
        "ALTER TABLE chefs ADD COLUMN IF NOT EXISTS food_photos TEXT",
        "ALTER TABLE chefs ADD COLUMN IF NOT EXISTS instagram_handle VARCHAR",
        "ALTER TABLE booking_requests ALTER COLUMN customer_id DROP NOT NULL",
        "ALTER TABLE booking_requests ADD COLUMN IF NOT EXISTS guest_count INTEGER",
        "ALTER TABLE booking_requests ADD COLUMN IF NOT EXISTS message TEXT",
                """
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_name = 'booking_requests' AND column_name = 'number_of_guests'
                    ) THEN
                        EXECUTE 'UPDATE booking_requests SET number_of_guests = guest_count WHERE number_of_guests IS NULL AND guest_count IS NOT NULL';
                        EXECUTE 'ALTER TABLE booking_requests ALTER COLUMN number_of_guests DROP NOT NULL';
                    END IF;
                END $$
                """,
                """
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_name = 'booking_requests' AND column_name = 'number_of_guests'
                    ) THEN
                        EXECUTE 'UPDATE booking_requests SET guest_count = number_of_guests WHERE guest_count IS NULL AND number_of_guests IS NOT NULL';
                    END IF;
                END $$
                """,
                """
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_name = 'booking_requests' AND column_name = 'notes'
                    ) THEN
                        EXECUTE 'UPDATE booking_requests SET message = notes WHERE message IS NULL AND notes IS NOT NULL';
                    END IF;
                END $$
                """,
    ]

    with engine.begin() as conn:
        for statement in statements:
            conn.execute(text(statement))
