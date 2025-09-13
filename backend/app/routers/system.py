from fastapi import APIRouter, HTTPException
import platform

router = APIRouter(prefix="/system", tags=["system"]) 


@router.post("/volume")
def set_volume(level: int):
    if not 0 <= level <= 100:
        raise HTTPException(status_code=400, detail="level must be 0-100")
    return {"ok": True, "message": f"Requested volume {level}. Requires OS integration."}


@router.post("/brightness")
def set_brightness(level: int):
    if not 0 <= level <= 100:
        raise HTTPException(status_code=400, detail="level must be 0-100")
    return {"ok": True, "message": f"Requested brightness {level}. Requires OS integration."}


@router.post("/open")
def open_app(app: str):
    return {"ok": True, "message": f"Requested to open {app} on {platform.system()}."}


@router.post("/lock")
def lock():
    return {"ok": True, "message": "Requested to lock the system. Requires OS integration."}


@router.post("/shutdown")
def shutdown():
    return {"ok": True, "message": "Requested to shutdown the system. Requires OS integration."}
