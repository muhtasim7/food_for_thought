from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from jose import JWTError, jwt
from secrets import token_urlsafe
import bcrypt
from app.config import settings
from app.models import User, Chef
from app.schemas import UserCreate, TokenData


class AuthService:
    """Service for authentication and user management"""

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)

        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
        return encoded_jwt

    @staticmethod
    def verify_token(token: str) -> Optional[TokenData]:
        """Verify JWT token and return token data.

        Supports both locally signed HS256 tokens and Supabase ES256 tokens.
        """
        local_payload = AuthService._decode_local_token(token)
        if local_payload:
            return AuthService._payload_to_token_data(local_payload)

        supabase_payload = AuthService._decode_supabase_token(token)
        if supabase_payload:
            return AuthService._payload_to_token_data(supabase_payload)

        return None

    @staticmethod
    def _decode_local_token(token: str) -> Optional[dict]:
        """Decode tokens signed by this API."""
        try:
            return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        except JWTError:
            return None

    @staticmethod
    def _decode_supabase_token(token: str) -> Optional[dict]:
        """Decode tokens signed by Supabase using ES256 JWK public key."""
        if not settings.supabase_jwt_x or not settings.supabase_jwt_y:
            return None

        key = {
            "kty": settings.supabase_jwt_kty,
            "crv": settings.supabase_jwt_crv,
            "x": settings.supabase_jwt_x,
            "y": settings.supabase_jwt_y,
        }
        if settings.supabase_jwt_kid:
            key["kid"] = settings.supabase_jwt_kid

        try:
            return jwt.decode(
                token,
                key,
                algorithms=[settings.supabase_jwt_alg],
                options={"verify_aud": False},
            )
        except JWTError:
            return None

    @staticmethod
    def _payload_to_token_data(payload: dict) -> Optional[TokenData]:
        """Normalize JWT payloads from local auth or Supabase auth."""
        email = payload.get("email")
        subject = payload.get("sub")

        # Existing local tokens store email in sub.
        if not email and isinstance(subject, str) and "@" in subject:
            email = subject

        if not email:
            return None

        return TokenData(
            email=email,
            subject=subject,
            full_name=payload.get("name") or payload.get("user_metadata", {}).get("full_name"),
        )

    @staticmethod
    def register_user(db: Session, user_data: UserCreate, is_chef: bool = False) -> Optional[User]:
        """Register new user"""
        # Check if email already exists
        if db.query(User).filter(User.email == user_data.email).first():
            return None

        user = User(
            email=user_data.email,
            password_hash=AuthService.hash_password(user_data.password),
            full_name=user_data.full_name,
            phone=user_data.phone,
            is_chef=is_chef
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not AuthService.verify_password(password, user.password_hash):
            return None
        return user

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_or_create_user_from_token(db: Session, token_data: TokenData) -> Optional[User]:
        """Find existing user by email or create one for first-time Supabase auth."""
        if not token_data.email:
            return None

        user = AuthService.get_user_by_email(db, token_data.email)
        if user:
            return user

        local_name = token_data.email.split("@")[0]
        full_name = token_data.full_name or local_name
        placeholder_password = AuthService.hash_password(token_urlsafe(32))

        user = User(
            email=token_data.email,
            password_hash=placeholder_password,
            full_name=full_name,
            phone=None,
            is_chef=False,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
