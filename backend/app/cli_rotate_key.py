import os
from cryptography.fernet import Fernet, InvalidToken
from .db import SessionLocal
from .models import History, User
from .security import get_fernet


def rotate_key(new_key: str):
    db = SessionLocal()
    try:
        old_fernet = get_fernet()
        new_fernet = Fernet(new_key.encode())

        # Re-encrypt history content if possible
        for row in db.query(History).all():
            try:
                if old_fernet:
                    plaintext = old_fernet.decrypt(row.content_enc)
                else:
                    plaintext = row.content_enc
                row.content_enc = new_fernet.encrypt(plaintext)
            except InvalidToken:
                continue
        db.commit()
        print("Rotation completed for history records.")
    finally:
        db.close()


if __name__ == "__main__":
    key = Fernet.generate_key().decode()
    print("Generated new key:", key)
    print("Set FERNET_KEY in your environment and re-run the rotation with rotate_key(new_key)")
