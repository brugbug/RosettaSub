export const StatusMessage: React.FC<{ message: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className={`mt-4 p-3 rounded-md max-w-md mx-auto
      ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
      {message}
    </div>
  );
};