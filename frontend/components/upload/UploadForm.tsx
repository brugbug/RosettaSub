interface UploadFormProps {
  isLoading: boolean;
  selectedFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  isLoading, selectedFile, handleFileChange, handleSubmit
}) => (
  <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Upload Audio File</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
          Select an audio file (MP3 or WAV)
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept="audio/*,video/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !selectedFile}
        className={`w-full py-2 px-4 rounded-md text-white font-medium
          ${isLoading || !selectedFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isLoading ? 'Processing...' : 'Upload'}
      </button>
    </form>
  </div>
);