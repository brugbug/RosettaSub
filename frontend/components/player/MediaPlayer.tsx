import React, { useEffect, useRef } from 'react';

interface MediaPlayerProps {
  mediaUrl: string;
  subtitleUrl: string | null;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ mediaUrl, subtitleUrl }) => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {     // This ensures subtitles are properly loaded when the URLs change
    if (mediaRef.current) {
      mediaRef.current.load();
    }
  }, [mediaUrl, subtitleUrl]);

  return (
    <div className="w-full mt-6 rounded-lg overflow-hidden bg-gray-100 shadow">
      <h3 className="text-lg font-semibold px-4 py-2 bg-blue-50">Media Preview with Subtitles</h3>
      <div className="p-4">
        <video 
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          controls
          className="w-full rounded"
          crossOrigin="anonymous"
        >
          <source src={mediaUrl} />
          {subtitleUrl && <track 
            default 
            kind="subtitles" 
            srcLang="en" 
            src={subtitleUrl} 
          />}
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default MediaPlayer;