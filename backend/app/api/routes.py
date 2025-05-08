from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
import os
import uuid
from app.core.config import settings

router = APIRouter()    # Create new router instance to be imported in main.py

@router.post("/transcribe/")    # Receive post requests to /api/v1/transcribe
async def transcribe_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
  
    # Validate file type
    if file.content_type not in ["audio/mpeg", "audio/wav"]:
        raise HTTPException(status_code=400, detail="Only MP3 or WAV files are supported")
    
    # Generate a unique filename (so that there are no conflicts)
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
    
    # ====================================================
    # TRANSCRIBE AUDIO FILE HERE
    # ====================================================

    # Return file path for now (this will be replaced with actual transcription logic)
    return {"message": "File uploaded successfully", "file_path": file_path}


@router.post("/translate/")     # /api/v1/translate
async def translate_subtitles():
    """
    Endpoint to translate subtitles.
    This is a placeholder that will be expanded in Iteration 3.
    """
    return {"message": "Translation endpoint placeholder"}