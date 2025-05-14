import React, { useEffect, useRef } from 'react';

interface MediaPlayerProps {
  mediaUrl: string;
  subtitleUrl: string | null;
  mediaType: 'audio' | 'video';
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ mediaUrl, subtitleUrl, mediaType }) => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  
  useEffect(() => {     // This ensures subtitles are properly loaded when the URLs change
    if (mediaRef.current) {
      mediaRef.current.load();
    }
  }, [mediaUrl, subtitleUrl]);

  return (
    <div className="w-full mt-6 rounded-lg overflow-hidden bg-gray-100 shadow">
      <h3 className="text-lg font-semibold px-4 py-2 bg-blue-50">Media Preview with Subtitles</h3>
      
      <div className="p-4">
        {mediaType === 'video' ? (
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
        ) : (
          <div>
            <audio 
              ref={mediaRef as React.RefObject<HTMLAudioElement>}
              controls
              className="w-full mb-4"
              crossOrigin="anonymous"
            >
              <source src={mediaUrl} />
              {subtitleUrl && <track 
                default 
                kind="subtitles" 
                srcLang="en" 
                src={subtitleUrl} 
              />}
              Your browser does not support the audio tag.
            </audio>
            
            {/* For audio files, we can show subtitles in a separate container */}
            {subtitleUrl && (
              <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 h-24 overflow-y-auto">
                <p className="text-center text-sm text-gray-500">
                  Subtitles will appear here during playback
                </p>
                {/* This div will be populated with active subtitles via JavaScript */}
                <div id="audio-subtitles" className="text-center font-medium"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPlayer;