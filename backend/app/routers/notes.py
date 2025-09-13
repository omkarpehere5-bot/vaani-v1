from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...app.db import get_db
from ...app import models
from ...app.schemas import NoteCreate, NoteOut

router = APIRouter(prefix="/notes", tags=["notes"])


@router.post("", response_model=NoteOut)
def create_note(note_in: NoteCreate, db: Session = Depends(get_db)):
    note = models.Note(user_id=0, title=name_guard(note_in.title), content=note_in.content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("", response_model=List[NoteOut])
def list_notes(db: Session = Depends(get_db)):
    return db.query(models.Note).order_by(models.Note.created_at.desc()).all()


@router.get("/{note_id}", response_model=NoteOut)
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.put("/{note_id}", response_model=NoteOut)
def update_note(note_id: int, note_in: NoteCreate, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note.title = name_guard(note_in.title)
    note.content = note_in.content
    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"ok": True}


# Simple guard to avoid empty titles

def name_guard(title: str) -> str:
    t = title.strip()
    return t if t else "Untitled"
