from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from datetime import datetime
from typing import Callable

scheduler = BackgroundScheduler(timezone="UTC")


def start_scheduler():
    if not scheduler.running:
        scheduler.start()


def schedule_one_time(job_id: str, run_at: datetime, func: Callable, args=None, kwargs=None):
    scheduler.add_job(func, DateTrigger(run_date=run_at), id=job_id, replace_existing=True, args=args or [], kwargs=kwargs or {})
