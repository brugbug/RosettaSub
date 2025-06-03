import React, { useEffect, useRef, useState } from 'react';

interface MediaPlayerProps {
  mediaUrl: string;
  subtitleUrl: string | null;
  backgroundImage?: string; // For future audio background support
}

interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ mediaUrl, subtitleUrl, backgroundImage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [subtitles, setSubtitles] = useState<SubtitleCue[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  
  const isAudio = mediaUrl.endsWith('.mp3') || mediaUrl.endsWith('.wav') || mediaUrl.endsWith('.m4a');

  // Parse VTT subtitle file
  const parseWebVTT = (vttContent: string): SubtitleCue[] => {
    const lines = vttContent.split('\n');
    const cues: SubtitleCue[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();
      
      // Look for timestamp lines (format: 00:00:00.000 --> 00:00:00.000)
      if (line.includes('-->')) {
        const [startStr, endStr] = line.split('-->').map(s => s.trim());
        const start = parseTimestamp(startStr);
        const end = parseTimestamp(endStr);
        
        // Collect subtitle text (next non-empty lines until empty line or end)
        i++;
        let text = '';
        while (i < lines.length && lines[i].trim() !== '') {
          if (text) text += ' ';
          text += lines[i].trim();
          i++;
        }
        
        if (text) {
          cues.push({ start, end, text });
        }
      }
      i++;
    }
    
    return cues;
  };

  // Parse individual timestamp strings from VTT file into seconds
  const parseTimestamp = (timestamp: string): number => { // timestamp before parsing: 00:00:00.000
    const parts = timestamp.split(':');
    const seconds = parts[parts.length - 1].split('.');
    
    if (parts.length === 3) { // HH:MM:SS.mmm format
      return (
        parseInt(parts[0]) * 3600 +           // convert hours to seconds
        parseInt(parts[1]) * 60 +             // convert minutes to seconds
        parseInt(seconds[0]) +                // seconds
        (parseInt(seconds[1] || '0') / 1000)  // convert milliseconds to seconds
      );
    } else {  // MM:SS.mmm format
      return (
        parseInt(parts[0]) * 60 +
        parseInt(seconds[0]) +
        (parseInt(seconds[1] || '0') / 1000)
      );
    }
  };

  // Handle time updates of the media element that calls this function
  const handleTimeUpdate = () => {
    const mediaElement = isAudio ? audioRef.current : videoRef.current;
    if (mediaElement) {
      setCurrentTime(mediaElement.currentTime);
    }
  };

  // Load subtitles when subtitleUrl changes
  useEffect(() => {
    if (subtitleUrl) {
      fetch(subtitleUrl)
        .then(response => response.text())
        .then(vttContent => {
          const parsedSubtitles = parseWebVTT(vttContent);
          setSubtitles(parsedSubtitles);
        })
        .catch(error => {
          console.error('Error loading subtitles:', error);
        });
    } else {
      setSubtitles([]);
    }
  }, [subtitleUrl]);

  // Update current subtitle based on time
  useEffect(() => {
    const currentCue = subtitles.find(
      cue => currentTime >= cue.start && currentTime <= cue.end
    );
    setCurrentSubtitle(currentCue ? currentCue.text : '');
  }, [currentTime, subtitles]);

  // Load media when URL changes
  useEffect(() => {
    const mediaElement = isAudio ? audioRef.current : videoRef.current;
    if (mediaElement) {
      mediaElement.load();
    }
  }, [mediaUrl, subtitleUrl, isAudio]);

  return (
    <div className="w-full mt-6 rounded-lg overflow-hidden bg-gray-100 shadow">
      <h3 className="text-lg font-semibold px-4 py-2 bg-blue-50">
        Media Preview with Subtitles
      </h3>
      <div className="p-4">
        {isAudio ? (
          <div className="space-y-4">
            {/* Audio Background Area */}
{/*             
            <div 
              className="w-full h-64 rounded flex items-center justify-center relative overflow-hidden"
              style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: backgroundImage ? undefined : '#1f2937'
              }}
            >
              {!backgroundImage && (
                <div className="text-white text-6xl">
                  🎵
                </div>
              )}
              
              {currentSubtitle && (
                <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded text-center">
                  <p className="text-lg font-medium leading-relaxed">
                    {currentSubtitle}
                  </p>
                </div>
              )}
            </div> 
*/}

            {/* Audio Element */}
            <audio
              ref={audioRef}
              controls
              className="w-full"
              crossOrigin="anonymous"
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
            >
              <source src={mediaUrl} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        ) : (
          /* Video Element */
          <video
            ref={videoRef}
            controls
            className="w-full rounded"
            crossOrigin="anonymous"
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
          >
            <source src={mediaUrl} type="video/mp4" />
            {subtitleUrl && (
              <track
                default
                kind="subtitles"
                srcLang="en"
                src={subtitleUrl}
                label="English"
              />
            )}
            Your browser does not support the video tag.
          </video>
        )}


        {/* Subtitle Display for Audio (can also show for video as backup) */}
        {isAudio && currentSubtitle && (
          <div className="mt-2 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
            <p className="text-gray-800 text-center font-medium">
              {currentSubtitle}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default MediaPlayer;