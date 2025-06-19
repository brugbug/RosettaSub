import os
from fastapi import HTTPException
from pathlib import Path
from typing import Optional, Tuple, List
from google import genai
from app.core.config import settings

LANGUAGE_CODE_TO_NAME = {
    "detect": "(Detect Language)",
    "en": "English",
    "fr": "French",
    "es": "Spanish",
    "ja": "Japanese",
    "ko": "Korean",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "eu": "Basque",
    "be": "Belarusian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "eo": "Esperanto",
    "et": "Estonian",
    "fi": "Finnish",
    "fy": "Frisian",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "he": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "jv": "Javanese",
    "kn": "Kannada",
    "kk": "Kazakh",
    "km": "Khmer",
    "rw": "Kinyarwanda",
    "ku": "Kurdish",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "lb": "Luxembourgish",
    "mk": "Macedonian",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mn": "Mongolian",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "no": "Norwegian",
    "ny": "Nyanja (Chichewa)",
    "or": "Odia (Oriya)",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "gd": "Scots Gaelic",
    "sr": "Serbian",
    "st": "Sesotho",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala (Sinhalese)",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "su": "Sundanese",
    "sw": "Swahili",
    "sv": "Swedish",
    "tl": "Tagalog (Filipino)",
    "tg": "Tajik",
    "ta": "Tamil",
    "tt": "Tatar",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "tk": "Turkmen",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "ug": "Uyghur",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu",
}

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

def create_concise_prompt(vtt_string: str, source_language: str, target_language: str) -> str:
    """
    Create a concise prompt for translation based on the VTT content and languages.
    
    Args:
        vtt_string: Content of the VTT file as a string
        source_language: Source language of the subtitles (if "detect" then detect)
        target_language: Target language for translation
        
    Returns:
        Concise prompt string for translation
    """
    if source_language == "detect":
        instruction = f"Translate to {LANGUAGE_CODE_TO_NAME[target_language]}."
    else:
        instruction = f"Translate from {LANGUAGE_CODE_TO_NAME[source_language]} to {LANGUAGE_CODE_TO_NAME[target_language]}."

    prompt = (
        f"{instruction} Translate the following VTT file. Do not change timestamps. "
        "Respond only with the translated VTT content.\n\n"
        f"{vtt_string}"
    )

    print(f"\nGenerated prompt: {prompt[:100]}...")  # Print first 100 characters for debugging

    return prompt

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
    
    # if source_language == "auto":
    #     prompt = (
    #         f"Translate the following WebVTT (.vtt) subtitle file into {target_language}.\n"
    #         "Respond ONLY with the translated .vtt file content. Do NOT add any explanation, preamble, or formatting.\n\n"
    #         f"{vtt_string}"
    #     )

    # else:
    #     prompt = (
    #         f"Translate the following WebVTT (.vtt) subtitle file from {source_language} to {target_language}.\n"
    #         "Respond ONLY with the translated .vtt file content. Do NOT add any explanation, preamble, or formatting.\n\n"
    #         f"{vtt_string}"
    #     )

    prompt = create_concise_prompt(vtt_string, source_language, target_language)

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    )
    print(f"\nResponse from Gemini: {response.text[:100]}...")  # Print first 100 characters for debugging

    translated_vtt_path = create_vtt_from_translated_string(response.text, vtt_path)

    return translated_vtt_path