from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Form, Query
from fastapi.responses import FileResponse
import os
import uuid
import json
import mimetypes
from typing import Optional
from app.core.config import settings
from app.services.transcription import process_media_file

router = APIRouter()    # Create new router instance to be imported in main.py

@router.post("/transcribe/")    # Receive post requests to /api/v1/transcribe
async def transcribe_audio( 
    file: UploadFile = File(...),      # File to be transcribed (required)
    use_api: bool = Form(False),       # Determine if using OpenAI API for transcription (default: False)
):
    """
    Endpoint to transcribe an audio file and generate subtitles.
    
    Args:
        file: The audio file to transcribe
        use_api: Whether to use OpenAI API (True) or local model (False) for Whisper transcription
        model_size: Size of Whisper model to use (if using local model)
    
    Returns:
        JSON with transcription info and VTT file path
    """

    # Validate file type
    if file.content_type not in ["audio/mpeg", "audio/wav", "video/mp4", "video/quicktime"]:
        raise HTTPException(status_code=400, detail="Only MP3, WAV, MP4, or MOV files are supported")
    
    # Generate a unique filename (so that there are no conflicts)
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    # Save audio / video file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

    # Process the media file to transcribe VTT file for subtitles, and get path to media file
    try:
        vtt_file_path, media_file_path = process_media_file(file_path, use_api)

        # Get the filenames only (without the directory path)
        vtt_filename = os.path.basename(vtt_file_path)
        media_filename = os.path.basename(media_file_path)

        print("DEBUG: routes.py: vtt_file_path:", vtt_file_path, "media_file_path:", media_file_path)
        print("DEBUG: routes.py: vtt_filename:", vtt_filename, "media_filename:", media_filename)
        
        return {
            "message": "Transcription processed successfully",
            "media_file_path": media_file_path,
            "media_filename": media_filename,
            "vtt_file_path": vtt_file_path,
            "vtt_filename": vtt_filename,
        }
    
    except Exception as e:
        
        # Clean up the uploaded file if there was an error during processing
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")   # Error message
    
@router.get("/media/{media_filename}")    # /api/v1/media/{media_filename}
async def download_media(media_filename: str):
    """
    Endpoint to download the media file.
    
    Args:
        media_filename: The name of the media file to download
    
    Returns:
        The media file as a downloadable response
    """
    
    # Construct the full path to the media file
    media_file_path = os.path.join(settings.UPLOAD_DIR, media_filename)
    
    # Check if the file exists
    if not os.path.exists(media_file_path):
        raise HTTPException(status_code=404, detail="Media file not found")
    
    # Dynamically set the media type based on the file extension
    media_type, _ = mimetypes.guess_type(media_file_path)
    if media_type is None:
        media_type = "application/octet-stream" # Fallback to binary if type cannot be guessed
    
    return FileResponse(path=media_file_path, media_type=media_type, filename=media_filename)

@router.get("/download/{vtt_filename}")    # /api/v1/download/{vtt_filename}
async def download_vtt(vtt_filename: str):
    """
    Endpoint to download the generated VTT file.
    
    Args:
        vtt_filename: The name of the VTT file to download
    
    Returns:
        The VTT file as a downloadable response
    """
    
    # Construct the full path to the VTT file
    vtt_file_path = os.path.join(settings.UPLOAD_DIR, vtt_filename)
    
    # Check if the file exists
    if not os.path.exists(vtt_file_path):
        raise HTTPException(status_code=404, detail="VTT file not found")
    
    return FileResponse(path=vtt_file_path, media_type="text/vtt", filename=vtt_filename) # Return the file as a response

@router.post("/translate/")     # /api/v1/translate
async def translate_subtitles():
    """
    Endpoint to translate subtitles.
    This is a placeholder that will be expanded in Iteration 3.
    """
    return {"message": "Translation endpoint placeholder"}