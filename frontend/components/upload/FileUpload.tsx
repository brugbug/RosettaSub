import React, { useState } from 'react';
import axios from 'axios';
import { DownloadButton } from './DownloadButton';
import MediaPlayer from '../player/MediaPlayer';

// FileUpload.tsx, is a React Functional Component that allows users to upload audio files (MP3 or WAV) for transcription
const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [vttFilename, setVttFilename] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('audio');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {  // event handler for file input
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setMessage('');

      // Create a temporary URL for the selected file
      const url = URL.createObjectURL(files[0]);
      setMediaUrl(url);

      // Determine the media type based on the file extension
      const fileType = files[0].type;
      if (fileType.startsWith('audio/')) {
        setMediaType('audio');
      } 
      else {
        setMediaType('video');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {  // event handler for form submission
    event.preventDefault();
    
    if (!selectedFile) {
      setMessage('Please select a file first');
      return;
    }

    // Validate file type
    const fileType = selectedFile.type;
    if (!fileType.startsWith('audio/') && !fileType.startsWith('video/')) {
      setMessage('Only audio (MP3/WAV) or video files are allowed');
      return;
    }

    setIsLoading(true);
    
    // Make a post request to /transcribe API with the selected file
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transcribe/`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Handle the returned subtitles
      setMessage('File uploaded successfully!');
      console.log('Response:', response.data);
      setVttFilename(response.data.vtt_filename);
      console.log('VTT Filename:', vttFilename);

    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate the URL for the VTT file
  const subtitleUrl = vttFilename
    ? `${process.env.NEXT_PUBLIC_API_URL}/download/${vttFilename}`
    : null;

  console.log('Subtitle URL:', subtitleUrl);

  // Render the component  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Audio File</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="file-upload" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select an audio file (MP3 or WAV)
          </label>
          
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            accept="audio/*,video/*"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !selectedFile}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${isLoading || !selectedFile 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? 'Processing...' : 'Upload'}
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700' 
            : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {mediaUrl && subtitleUrl && (
        <MediaPlayer
          mediaUrl={mediaUrl}
          subtitleUrl={subtitleUrl}
          mediaType={mediaType}
        />
      )}

      {vttFilename && (
        <div className="mt-4">
          <DownloadButton filename={vttFilename} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;