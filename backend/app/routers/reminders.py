from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ...app.db import get_db
from ...app import models
from ...app.schemas import ReminderCreate, ReminderOut
from ...app.utils.scheduler import schedule_one_time, start_scheduler

router = APIRouter(prefix="/reminders", tags=["reminders"])


def _notify(reminder_id: int, message: str):
    # Placeholder notification function for local-first
    print(f"[Reminder Fired] #{reminder_id}: {message}")


@router.post("", response_model=ReminderOut)
def create_reminder(rem_in: ReminderCreate, db: Session = Depends(get_db)):
    start_scheduler()
    reminder = models.Reminder(user_id=0, datetime=rem_in.datetime, repeat=rem_in.repeat, message=rem_in.message, location=rem_in.location)
    db.add(reminder)
    db.commit()
    db.refresh(reminder)

    if reminder.is_active and reminder.datetime > datetime.utcnow():
        schedule_one_time(job_id=f"reminder:{reminder.id}", run_at=reminder.datetime, func=_notify, args=[reminder.id, reminder.message])

    return reminder


@router.get("", response_model=List[ReminderOut])
def list_reminders(db: Session = Depends(get_db)):
    return db.query(models.Reminder).order_by(models.Reminder.datetime.asc()).all()


@router.delete("/{reminder_id}")
def delete_reminder(reminder_id: int, db: Session = Depends(get_db)):
    reminder = db.query(models.Reminder).filter(models.Reminder.id == reminder_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db.delete(reminder)
    db.commit()
    return {"ok": True}
