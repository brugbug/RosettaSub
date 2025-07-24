import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import MediaPlayer from '../player/MediaPlayer';
import { UploadForm } from './UploadForm';
import { TranslationForm } from './TranslationForm';
import { DownloadButton } from './DownloadButton';
import { SubtitleSelectionForm } from './SubtitleSelectionForm';
import { LANGUAGE_CODE_TO_NAME } from '@/lib/constants/languageMap';

type VttFile = {
  language: string;
  filename: string;
}

// FileUpload.tsx, is a React Functional Component that allows users to upload audio files (MP3 or WAV) for transcription
const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFilename, setMediaFilename] = useState<string | null>(null);
  const [vttFiles, setVttFiles] = useState<VttFile[]>([]);
  const [originalVttFilename, setOriginalVttFilename] = useState<string | null>(null);
  const [selectedVttFilename, setSelectedVttFilename] = useState<string | null>(null);
  const [translateFrom, setTranslateFrom] = useState<string>('detect');
  const [translateTo, setTranslateTo] = useState<string>('');
  
  useEffect(() => { // useEffect to set the default value for translateFrom to 'detect' if not already set
    if (!translateFrom) setTranslateFrom('detect');
  }, []);

  // Generate the URLs for the media file and subtitles
  const mediaUrl = mediaFilename ? `${process.env.NEXT_PUBLIC_API_URL}/media/${mediaFilename}` : null;
  const subtitleUrl = selectedVttFilename ? `${process.env.NEXT_PUBLIC_API_URL}/download/${selectedVttFilename}` : null;
  if (mediaUrl) console.log('Media URL:', mediaUrl);
  if (subtitleUrl) console.log('Subtitle URL:', subtitleUrl);
  if (translateTo) console.log('Translate To:', translateTo);
  if (translateFrom) console.log('Translate From:', translateFrom);

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
      // TEMPORARY(?): Clear the uploads directory before uploading a new file
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clear-uploads/`); 
      console.log('Cleared uploads directory');

      setVttFiles([]); // Reset vttFiles before uploading a new file

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
      setVttFiles([{ language: 'Original', filename: response.data.vtt_filename }]);
      setOriginalVttFilename(response.data.vtt_filename);
      setSelectedVttFilename(response.data.vtt_filename);
      
      console.log('Response:', response.data, 
        '\nVTT Filename:', originalVttFilename, 
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
      // Check if VTT file is already translated to the selected language
      const existingFile = vttFiles.find(file => file.language === LANGUAGE_CODE_TO_NAME[translateTo]);
      if (existingFile) {
        toast.info(`File already exists for ${LANGUAGE_CODE_TO_NAME[translateTo]}.`);
        setSelectedVttFilename(existingFile.filename);
        return;
      }

      const formData = new FormData();
      formData.append('source_language', translateFrom);
      formData.append('target_language', translateTo);
      formData.append('filename', originalVttFilename || '');

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
      const newVttFile = { language: LANGUAGE_CODE_TO_NAME[translateTo], filename: response.data.translated_vtt_filename };
      setVttFiles(prev => {
        const updated = [...prev, newVttFile];
        setSelectedVttFilename(response.data.translated_vtt_filename); // set the selected filename after the vttFiles state has been updated
        return updated;
      });

      toast.success('File translated successfully!');
      console.log('Response:', response.data, 
        '\nVTT Filename:', originalVttFilename, 
        '\nTranslated VTT Filename:', vttFiles[vttFiles.length - 1]?.filename
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
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 transition-all duration-500 p-6 bg-lime-500/50 rounded-lg shadow-md">
      {/* LEFT COLUMN */}
      <div className="w-full md:w-1/2 max-w-md mx-auto p-6 bg-lime-500/80 rounded-lg shadow-md">
        <UploadForm
          isLoading={isLoading}
          selectedFile={selectedFile}
          handleFileChange={handleFileChange}
          handleSubmit={handleTranscriptionSubmit}
        />
        {mediaUrl && vttFiles.length && (
          <MediaPlayer mediaUrl={mediaUrl} subtitleUrl={subtitleUrl} />
        )}
        {selectedVttFilename && (
          <div className="mt-4 max-w-md mx-auto">
            <DownloadButton filename={selectedVttFilename} label="Download VTT" />
          </div>
        )}
      </div>
      {/* RIGHT COLUMN */}
      <AnimatePresence>
        {vttFiles.length && (
          <motion.div
            className="w-full md:w-1/2 max-w-md mx-auto p-6 bg-lime-500/80 rounded-lg shadow-md"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
          >
            {vttFiles.length && (
              <TranslationForm
                isLoading={isLoading}
                translateFrom={translateFrom}
                translateTo={translateTo}
                onTranslateFromChange={setTranslateFrom}
                onTranslateToChange={setTranslateTo}
                onSubmit={handleTranslationSubmit}
              />
            )}
            {/* {mediaUrl && translatedSubtitleUrl && (
              <MediaPlayer mediaUrl={mediaUrl} subtitleUrl={translatedSubtitleUrl} />
            )} */
            vttFiles.length && (
              <SubtitleSelectionForm
                vttFiles={vttFiles}
                selectedVttFilename={selectedVttFilename}
                onVttFilenameChange={setSelectedVttFilename}
              />
            )}
            {/* {translatedVttFilename && (
              <div className="mt-4 max-w-md mx-auto">
                <DownloadButton filename={translatedVttFilename} label="Download Translated VTT" />
              </div>
            )} */}
          </motion.div>
        )}

        
      </AnimatePresence>
    </div>
    
  );
};

export default FileUpload;