import React, { useState } from 'react';
import axios from 'axios';
import { DownloadButton } from './DownloadButton';

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [vttFilename, setVttFilename] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setMessage('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setMessage('Please select a file first');
      return;
    }

    const fileType = selectedFile.type;
    if (fileType !== 'audio/mpeg' && fileType !== 'audio/wav') {
      setMessage('Only MP3 or WAV files are allowed');
      return;
    }

    setIsLoading(true);
    
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
      
      setMessage('File uploaded successfully!');
      console.log('Response:', response.data);

      //  handle the returned subtitles
      setVttFilename(response.data.vtt_filename);
      console.log('VTT Filename:', vttFilename);

    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            accept=".mp3,.wav"
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

      {vttFilename && (
        <div className="mt-4">
          <DownloadButton filename={vttFilename} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;