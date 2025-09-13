from fastapi import APIRouter, UploadFile, File, HTTPException
from ..utils.vision import simple_describe
from ..schemas import OCRResponse, DescribeResponse

router = APIRouter(prefix="/vision", tags=["vision"])


@router.post("/ocr", response_model=OCRResponse)
async def ocr(file: UploadFile = File(...)):
    # Minimal local-first: read bytes and return length to indicate successful read
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    # In a real implementation, run pytesseract here
    return OCRResponse(text=f"Read {len(data)} bytes from image. OCR engine not configured.")


@router.post("/describe", response_model=DescribeResponse)
async def describe(file: UploadFile = File(...)):
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    # Return a generic description
    return DescribeResponse(description=simple_describe(0, 0))
