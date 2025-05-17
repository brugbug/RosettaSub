import os
import tempfile
import whisper
import ffmpeg
import time
import subprocess
from pathlib import Path
from typing import Optional, Tuple, List
from app.core.config import settings

# Option 1: Local Whisper model
def transcribe_audio_local(audio_path: str, model_size: str = "base") -> dict:
    """
    Transcribe audio using locally installed Whisper model.
    
    Args:
        audio_path: Path to the audio file
        model_size: Size of the Whisper model to use ("tiny", "base", "small", "medium", "large")
        
    Returns:
        Dictionary containing transcription data
    """
    # Load the Whisper model and transcribe the audio
    model = whisper.load_model(model_size)  # defaults to "base" for now, only requires 1GB RAM and is pretty fast
    result = model.transcribe(audio_path)
    
    return result   # returns a dictionary with the transcription and other metadata

# # Option 2: OpenAI API Whisper
# def transcribe_audio_api(audio_path: str) -> dict:
#     """
#     Transcribe audio using OpenAI's Whisper API.
    
#     Args:
#         audio_path: Path to the audio file
        
#     Returns:
#         Dictionary containing transcription data
#     """
#     import openai
    
#     # Set API key from environment variable
#     openai.api_key = settings.OPENAI_API_KEY
    
#     # Open the audio file
#     with open(audio_path, "rb") as audio_file:
#         # Call the OpenAI API
#         response = openai.Audio.transcribe("whisper-1", audio_file)
    
#     return response

def extract_audio_from_video(video_path: str) -> str:
    """
    Extract audio from a video file using ffmpeg.
    
    Args:
        video_path: Path to the video file
        
    Returns:
        Path to the extracted audio file
    """
    # Create output filename
    audio_path = os.path.splitext(video_path)[0] + ".mp3"
    
    try:
        print("DEBUG: Using FFmpeg through subprocess to extract audio")
        # Use subprocess to call FFmpeg using cmd line args for audio extraction
        cmd = [
            'ffmpeg', 
            '-i', video_path,       # input video file
            '-q:a', '2',            # audio quality
            '-map', 'a',            # map audio stream
            '-c:a', 'libmp3lame',   # audio codec
            audio_path              # output audio file
        ]
        
        subprocess.run(cmd, check=True, capture_output=True, text=True)
        
        # If subprocess succeeds but file wasn't created, fall back to ffmpeg-python
        if not os.path.exists(audio_path):
            print("DEBUG: Subprocess didn't work; Using FFmpeg through ffmpeg-python to extract audio")
            # Run ffmpeg to extract audio from the video using the ffmpeg-python library
            (
                ffmpeg
                .input(video_path)
                .output(audio_path, acodec='libmp3lame', q='2')
                .run(quiet=True, overwrite_output=True)
            )
    except subprocess.CalledProcessError as e:
        raise Exception(f"Error extracting audio with ffmpeg: {e.stderr.decode() if e.stderr else str(e)}")
    except Exception as e:
        raise Exception(f"Error extracting audio: {str(e)}")

    # Verify the file was created
    if not os.path.exists(audio_path):
        raise Exception("Audio extraction failed: output file was not created")
        
    # Return the .mp3 audio file
    return audio_path

def create_video_from_audio(audio_path: str) -> str:
    """
    Create video from an audio file using ffmpeg.
    
    Args:
        audio_path: Path to the audio file
        
    Returns:
        Path to the generated video file
    """
    # Create output filename
    video_path = os.path.splitext(audio_path)[0] + ".mp4"

    try:
        print("DEBUG: Using FFmpeg through subprocess to create video")
        # Use subprocess to call FFmpeg using cmd line args for video creation
        cmd = [
            'ffmpeg',
            '-i', audio_path,                       # input audio file
            '-f', 'lavfi',                          # input format for filter
            '-i', 'color=c=black:s=1280x720:r=24',  # generate black background
            '-shortest',                            # end when shortest input ends
            '-c:v', 'libx264',                      # video codec
            '-c:a', 'aac',                          # audio codec
            '-pix_fmt', 'yuv420p',                  # pixel format for compatibility
            '-y',                                   # overwrite output if exists
            video_path                              # output video file
        ]

        subprocess.run(cmd, check=True, capture_output=True, text=True)
        
    except subprocess.CalledProcessError as e:
        print("FFmpeg subprocess failed")
        print("Return code:", e.returncode)
        print("stdout:", e.stdout.decode() if e.stdout else "No stdout")
        print("stderr:", e.stderr.decode() if e.stderr else "No stderr")
        raise Exception(f"Error creating video with ffmpeg: {e.stderr.decode() if e.stderr else str(e)}")
    except Exception as e:
        raise Exception(f"Error creating video: {str(e)}")

    # Verify the file was created
    if not os.path.exists(video_path):
        raise Exception("Video creation failed: output file was not created")

    print("DEBUG: Video created successfully:", video_path)

    # Return the .mp4 video file
    return video_path

def generate_vtt_from_transcription(transcription: dict, output_path: Optional[str] = None) -> str:
    """
    Generate VTT subtitle file from Whisper transcription.
    
    Args:
        transcription: Whisper transcription data
        output_path: Optional path to save the VTT file
        
    Returns:
        Path to the generated VTT file
    """
    # If no output path is provided, create one based on timestamp
    if output_path is None:
        timestamp = int(time.time())
        output_path = os.path.join(settings.UPLOAD_DIR, f"subtitles_{timestamp}.vtt")
    
    # Format timestamps for VTT
    def format_timestamp(seconds: float) -> str:
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = seconds % 60
        return f"{hours:02d}:{minutes:02d}:{secs:06.3f}"#.replace(".", ",")
    
    # Write VTT file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("WEBVTT\n\n")
        
        # Handle different output formats from Whisper
        if 'segments' in transcription: # make sure the dictionary has the key 'segments'
            # Local Whisper dictionary format
            for i, segment in enumerate(transcription['segments']): 
                start_time = format_timestamp(segment['start'])
                end_time = format_timestamp(segment['end'])
                text = segment['text'].strip()    # remove leading/trailing whitespace
                
                # Write the segment to the VTT file in VTT format
                f.write(f"{i + 1}\n")                        # ex. 1 
                f.write(f"{start_time} --> {end_time}\n")    #     00:00:01.000 --> 00:00:05.000
                f.write(f"{text}\n\n")                       #     Hello, world!     
        # elif 'text' in transcription:
        #     # OpenAI API format - we'll need to split it into segments
        #     # Since API doesn't return timestamps, we'll create dummy ones
        #     text = transcription['text']
        #     words = text.split()
        #     segments = [words[i:i+10] for i in range(0, len(words), 10)]
            
        #     for i, segment_words in enumerate(segments):
        #         start_time = format_timestamp(i * 3)  # Approximate 3 seconds per segment
        #         end_time = format_timestamp((i + 1) * 3)
        #         text = " ".join(segment_words)
                
        #         f.write(f"{i + 1}\n")
        #         f.write(f"{start_time} --> {end_time}\n")
        #         f.write(f"{text}\n\n")
    
    # Return the path to the generated VTT file
    return output_path

def process_media_file(file_path: str, use_api: bool = False) -> tuple[str, str]:
    """
    Process a media file to generate subtitles.
    
    Args:
        file_path: Path to the media file (audio or video)
        use_api: Whether to use the OpenAI API (True) or local model (False)
        
    Returns:
        Tuple of (transcription_result, vtt_file_path)
    """
    
    # Determine if it's a video file that needs audio extraction or an audio file that needs video creation
    file_ext = os.path.splitext(file_path)[1].lower()
    is_video = file_ext in ['.mp4', '.mov', '.avi', '.mkv']
    is_audio = file_ext in ['.mp3', '.wav', '.flac', '.aac']

    # Extract audio if it's a video file
    if is_video:
        video_path = file_path
        audio_path = extract_audio_from_video(file_path)
    # Create video if it's an audio file
    elif is_audio:
        video_path = create_video_from_audio(file_path)
        audio_path = file_path
    else:
        raise ValueError("Unsupported file type. Only MP3, WAV, MP4, or MOV files are supported.")

    # Transcribe the audio
    if use_api:
        print("OpenAI API not ready yet...")
        # transcription = transcribe_audio_api(audio_path)
    else:
        transcription = transcribe_audio_local(audio_path)

    # Generate VTT subtitles
    vtt_path = generate_vtt_from_transcription(transcription)
    
    # Delete the audio file (since we only want the video and VTT file)
    os.remove(audio_path)

    # print("DEBUG: transcription.py: vtt_path:", vtt_path, "video_path:", video_path)
    
    # Return the paths to the VTT file and video file
    return vtt_path, video_path