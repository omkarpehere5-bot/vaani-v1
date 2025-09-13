from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from cryptography.fernet import Fernet, InvalidToken
from .config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Fernet helpers

_fernet: Optional[Fernet] = None


def get_fernet() -> Optional[Fernet]:
    global _fernet
    if _fernet is not None:
        return _fernet
    if not settings.fernet_key:
        return None
    _fernet = Fernet(settings.fernet_key.encode())
    return _fernet


def encrypt_value(value: Optional[str]) -> Optional[bytes]:
    if value is None:
        return None
    f = get_fernet()
    if not f:
        # No encryption configured; store as bytes for uniformity
        return value.encode()
    return f.encrypt(value.encode())


def decrypt_value(token: Optional[bytes]) -> Optional[str]:
    if token is None:
        return None
    f = get_fernet()
    if not f:
        try:
            return token.decode()
        except Exception:
            return None
    try:
        return f.decrypt(token).decode()
    except InvalidToken:
        return None
