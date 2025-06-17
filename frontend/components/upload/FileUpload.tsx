import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DownloadButton } from './DownloadButton';
import { LanguageSelectionForm } from './LanguageSelectionForm';
import MediaPlayer from '../player/MediaPlayer';
import { set } from 'react-hook-form';

// FileUpload.tsx, is a React Functional Component that allows users to upload audio files (MP3 or WAV) for transcription
const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');  
  const [mediaFilename, setMediaFilename] = useState<string | null>(null);
  const [vttFilename, setVttFilename] = useState<string | null>(null);
  const [translatedVttFilename, setTranslatedVttFilename] = useState<string | null>(null);
  const [translateFrom, setTranslateFrom] = useState<string>('detect');
  const [translateTo, setTranslateTo] = useState<string>('');

  // useEffect to set the default value for translateFrom to 'detect' if not already set
  useEffect(() => {
    if (!translateFrom) {
      setTranslateFrom('detect');
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {  // event handler for file input
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setMessage('');
    }
  };

  const handleTranscriptionSubmit = async (event: React.FormEvent) => {  // event handler for form submission
    event.preventDefault();
    
    if (!selectedFile) {
      setMessage('Please select a file first');
      return;
    }

    // Validate file type
    const fileType = selectedFile.type;
    if (!fileType.startsWith('audio/') && !fileType.startsWith('video/')) {
      setMessage('Only audio or video files are allowed');
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
      setMediaFilename(response.data.media_filename);
      setVttFilename(response.data.vtt_filename);
      console.log('Response:', response.data, 
        '\nVTT Filename:', vttFilename, 
        '\nMedia Filename:', mediaFilename);

    } catch (error) {
      setMessage('Error uploading file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslationSubmit = async (event: React.FormEvent) => { // event handler for translation submission
    event.preventDefault();

    console.log('Translation settings:', {
      translateFrom,
      translateTo,
      vttFilename
    });

    // Make a post request to /transcribe API with the selected file
    try {
      const formData = new FormData();
      formData.append('source_language', translateFrom);
      formData.append('target_language', translateTo);
      formData.append('filename', vttFilename || '');

      setIsLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/translate/`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Handle the returned subtitles
      setMessage('File translated successfully!');
      setTranslatedVttFilename(response.data.translated_vtt_filename);
      console.log('Response:', response.data, 
        '\nVTT Filename:', vttFilename, 
        '\nTranslated VTT Filename:', translatedVttFilename,
        '\nLink:', translatedSubtitleUrl
      );

    } catch (error) {
      setMessage('Error translating file. Please try again.');
      console.error('Error translating file:', error);
    } finally {
      setIsLoading(false);
      setTranslateFrom('detect'); // Reset translateFrom to 'detect' after translation
      setTranslateTo(''); // Reset translateTo after translation
    }
  };

  // Generate the URL for the media file
  const mediaUrl = mediaFilename
    ? `${process.env.NEXT_PUBLIC_API_URL}/media/${mediaFilename}`
    : null;

  // Generate the URL for the VTT file
  const subtitleUrl = vttFilename
    ? `${process.env.NEXT_PUBLIC_API_URL}/download/${vttFilename}`
    : null;

  // Generate the URL for the translated VTT file
  const translatedSubtitleUrl = translatedVttFilename
    ? `${process.env.NEXT_PUBLIC_API_URL}/download/${translatedVttFilename}`
    : null;

  if (mediaUrl) {
    console.log('Media URL:', mediaUrl);
  }
  if (subtitleUrl) {
    console.log('Subtitle URL:', subtitleUrl);
  }
  if (translatedSubtitleUrl) {
    console.log('Translated Subtitle URL:', translatedSubtitleUrl);
  }

  // Render the component  
  return (
    <div>
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Upload Audio File</h2>
        
        <form onSubmit={handleTranscriptionSubmit}>
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
          />
        )}

        {vttFilename && (
          <div className="mt-4">
            <DownloadButton
              filename={vttFilename}
              label="Download VTT"
            />
          </div>
        )}
      </div>
      {subtitleUrl && (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Subtitle Translation</h2>
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <LanguageSelectionForm 
                label="Translate From: "
                detect={true} 
                value={translateFrom}
                onValueChange={setTranslateFrom} 
              />
            </div>
            <div className="flex-1">
              <LanguageSelectionForm 
                label="Translate To: "
                value={translateTo}
                onValueChange={setTranslateTo} 
              />
            </div>
          </div>

          <button
            onClick={handleTranslationSubmit}
            disabled={isLoading || !translateFrom || !translateTo}
            className={`w-full mt-4 py-2 px-4 rounded-md text-white font-medium
              ${isLoading || !translateFrom || !translateTo 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isLoading ? 'Processing...' : 'Translate'}
          </button>

          {translatedVttFilename && (
            <div className="mt-4">
              <DownloadButton 
                filename={translatedVttFilename}
                label="Download Translated VTT"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;