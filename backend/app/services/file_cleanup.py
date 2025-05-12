import os
import shutil
from app.core.config import settings

def clear_uploads_directory():
    """
    Clear all files in the uploads directory on application startup
    """
    try:
        # Ensure the directory exists
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        
        # Remove all files in the directory
        for filename in os.listdir(settings.UPLOAD_DIR):    # iterate through all files in the /uploads directory
            file_path = os.path.join(settings.UPLOAD_DIR, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):  
                    os.unlink(file_path)          # remove file or symbolic link
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)      # remove directory and all its contents
            except Exception as e:
                print(f'Failed to delete {file_path}: {e}')
    except Exception as e:
        print(f'Error clearing /uploads directory: {e}')