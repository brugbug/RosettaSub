import os
from fastapi import HTTPException
from pathlib import Path
from typing import Optional, Tuple, List
from google import genai
from app.core.config import settings

def get_vtt_string(vtt_path: str) -> str:
    """
    Read the VTT file and return its content as a string.
    
    Args:
        vtt_path: Path to the VTT file

    Returns:
        Content of the VTT file as a string
    """
    try:
        with open(vtt_path, "r", encoding="utf-8") as f:
            vtt_text = f.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading VTT file: {str(e)}")

    return vtt_text

def create_vtt_from_translated_string(vtt_string: str, old_vtt_path: str) -> str:
    """
    Create a VTT file from a string.

    Args:
        vtt_string: Content of the VTT file as a string

    Returns:
        Path to the created VTT file
    """
    translated_vtt_path = Path(old_vtt_path).with_suffix(".translated.vtt")
    try:
        with open(translated_vtt_path, "w", encoding="utf-8") as f:
            f.write(vtt_string)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating VTT file: {str(e)}")

    return translated_vtt_path

def process_vtt_file(vtt_path: str, source_language: str, target_language: str) -> tuple[str, str]:
    """
    Translate subtitles from source language (if provided) to target language.
    
    Args:
        vtt_path: Path to the VTT file to be translated
        source_language: Source language of the subtitles (if "auto" then detect)
        target_language: Target language for translation
        
    Returns:
        Path to the translated VTT file
    """

    if not os.path.exists(vtt_path):
        raise HTTPException(status_code=404, detail="VTT file not found")
    
    vtt_string = get_vtt_string(vtt_path)
    
    if source_language == "auto":
        prompt = (
            f"Translate the following WebVTT (.vtt) subtitle file into {target_language}.\n"
            "Respond ONLY with the translated .vtt file content. Do NOT add any explanation, preamble, or formatting.\n\n"
            f"{vtt_string}"
        )

    else:
        prompt = (
            f"Translate the following WebVTT (.vtt) subtitle file from {source_language} to {target_language}.\n"
            "Respond ONLY with the translated .vtt file content. Do NOT add any explanation, preamble, or formatting.\n\n"
            f"{vtt_string}"
        )

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    )
    print(response.text)

    translated_vtt_path = create_vtt_from_translated_string(response.text, vtt_path)

    return translated_vtt_path