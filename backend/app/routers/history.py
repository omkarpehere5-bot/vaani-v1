from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ...app.db import get_db
from ...app.models import History
from ...app.security import decrypt_value

router = APIRouter(prefix="/history", tags=["history"]) 


@router.get("")
def list_history(db: Session = Depends(get_db)):
    rows = db.query(History).order_by(History.created_at.desc()).limit(100).all()
    return [
        {"id": r.id, "role": r.role, "content": decrypt_value(r.content_enc), "created_at": r.created_at.isoformat()}
        for r in rows
    ]


@router.delete("/clear")
def clear_history(db: Session = Depends(get_db)):
    db.query(History).delete()
    db.commit()
    return {"ok": True}
