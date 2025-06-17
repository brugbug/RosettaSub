import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import MediaPlayer from '../player/MediaPlayer';
import { UploadForm } from './UploadForm';
import { TranslationForm } from './TranslationForm';
import { DownloadButton } from './DownloadButton';

// FileUpload.tsx, is a React Functional Component that allows users to upload audio files (MP3 or WAV) for transcription
const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFilename, setMediaFilename] = useState<string | null>(null);
  const [vttFilename, setVttFilename] = useState<string | null>(null);
  const [translatedVttFilename, setTranslatedVttFilename] = useState<string | null>(null);
  const [translateFrom, setTranslateFrom] = useState<string>('detect');
  const [translateTo, setTranslateTo] = useState<string>('');
  
  useEffect(() => { // useEffect to set the default value for translateFrom to 'detect' if not already set
    if (!translateFrom) setTranslateFrom('detect');
  }, []);

  // Generate the URLs for the media file and subtitles
  const mediaUrl = mediaFilename ? `${process.env.NEXT_PUBLIC_API_URL}/media/${mediaFilename}` : null;
  const subtitleUrl = vttFilename ? `${process.env.NEXT_PUBLIC_API_URL}/download/${vttFilename}` : null;
  const translatedSubtitleUrl = translatedVttFilename ? `${process.env.NEXT_PUBLIC_API_URL}/download/${translatedVttFilename}` : null;
  if (mediaUrl) console.log('Media URL:', mediaUrl);
  if (subtitleUrl) console.log('Subtitle URL:', subtitleUrl);
  if (translatedSubtitleUrl) console.log('Translated Subtitle URL:', translatedSubtitleUrl);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {  // event handler for file input
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleTranscriptionSubmit = async (event: React.FormEvent) => {  // event handler for form submission
    event.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    // Validate file type
    const fileType = selectedFile.type;
    if (!fileType.startsWith('audio/') && !fileType.startsWith('video/')) {
      toast.error('Only audio or video files are allowed');
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
      toast.success('File uploaded successfully!');
      setMediaFilename(response.data.media_filename);
      setVttFilename(response.data.vtt_filename);
      console.log('Response:', response.data, 
        '\nVTT Filename:', vttFilename, 
        '\nMedia Filename:', mediaFilename);

    } catch (error) {
      toast.error('Error uploading file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslationSubmit = async (event: React.FormEvent) => { // event handler for translation submission
    event.preventDefault();

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
      toast.success('File translated successfully!');
      setTranslatedVttFilename(response.data.translated_vtt_filename);
      console.log('Response:', response.data, 
        '\nVTT Filename:', vttFilename, 
        '\nTranslated VTT Filename:', translatedVttFilename,
        '\nLink:', translatedSubtitleUrl
      );

    } catch (error) {
      toast.error('Error translating file. Please try again.');
      console.error('Error translating file:', error);
    } finally {
      setIsLoading(false);
      setTranslateFrom('detect'); // Reset translateFrom to 'detect' after translation
      setTranslateTo(''); // Reset translateTo after translation
    }
  };

  // Render the component  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <UploadForm
        isLoading={isLoading}
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        handleSubmit={handleTranscriptionSubmit}
      />

      {mediaUrl && subtitleUrl && (
        <MediaPlayer mediaUrl={mediaUrl} subtitleUrl={subtitleUrl} />
      )}

      {vttFilename && (
        <div className="mt-4 max-w-md mx-auto">
          <DownloadButton filename={vttFilename} label="Download VTT" />
        </div>
      )}

      {subtitleUrl && (
        <TranslationForm
          isLoading={isLoading}
          translateFrom={translateFrom}
          translateTo={translateTo}
          onTranslateFromChange={setTranslateFrom}
          onTranslateToChange={setTranslateTo}
          onSubmit={handleTranslationSubmit}
        />
      )}

      {translatedVttFilename && (
        <div className="mt-4 max-w-md mx-auto">
          <DownloadButton filename={translatedVttFilename} label="Download Translated VTT" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;