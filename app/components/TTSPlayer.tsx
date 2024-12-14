"use client";

import { useState, useRef, useEffect } from 'react';

interface TTSPlayerProps {
  text: string;
  title?: string;
  onTextChange?: (newText: string) => void;
}

interface CharacterTiming {
  char: string;
  start: number;
  end: number;
}

export default function TTSPlayer({ text: initialText, title = "NOW PLAYING", onTextChange }: TTSPlayerProps) {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [characterTimings, setCharacterTimings] = useState<CharacterTiming[]>([]);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle text editing
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange?.(newText);
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setIsEditing(false);
      // Reset audio state since text changed
      setCharacterTimings([]);
      setCurrentCharIndex(-1);
      if (audioRef.current) {
        audioRef.current.src = '';
      }
    } else {
      // Enter edit mode
      setIsEditing(true);
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text, isEditing]);

  const handleSpeak = async () => {
    try {
      setLoading(true);

      // First, try to generate new audio
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('TTS request failed');

      const data = await response.json();
      setCharacterTimings(data.characterTimings);

      // Save the audio file
      const saveResponse = await fetch('/api/save-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          audio: data.audio,
          text: text 
        }),
      });

      if (!saveResponse.ok) throw new Error('Failed to save audio');

      const { audioUrl: savedAudioUrl } = await saveResponse.json();
      setAudioUrl(savedAudioUrl);
      
      if (audioRef.current) {
        audioRef.current.src = savedAudioUrl;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const currentTime = e.currentTarget.currentTime;
    const totalDuration = e.currentTarget.duration;
    setCurrentTime(currentTime);
    
    // Normalize the timestamps based on total audio duration
    if (characterTimings.length > 0) {
      const lastTiming = characterTimings[characterTimings.length - 1];
      const timeScale = totalDuration / lastTiming.end;

      // Find the character being spoken at the scaled current time
      let foundIndex = -1;
      for (let i = 0; i < characterTimings.length; i++) {
        const timing = characterTimings[i];
        const scaledStart = timing.start * timeScale;
        const scaledEnd = timing.end * timeScale;
        
        if (currentTime >= scaledStart && currentTime < scaledEnd) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex !== currentCharIndex) {
        setCurrentCharIndex(foundIndex);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderText = () => {
    if (!characterTimings.length) return text;

    // Group characters into words and track the currently spoken character
    const words: { text: string; isHighlighted: boolean }[] = [];
    let currentWord = '';
    let currentWordStartIndex = -1;

    characterTimings.forEach((timing, index) => {
      // Start a new word if needed
      if (index === 0 || timing.char.match(/\s/) || characterTimings[index - 1].char.match(/\s/)) {
        if (currentWord) {
          // Add the completed word
          words.push({
            text: currentWord,
            isHighlighted: currentWordStartIndex <= currentCharIndex && 
                          currentCharIndex < index
          });
        }
        currentWord = '';
        currentWordStartIndex = index;
      }

      // Add character to current word
      currentWord += timing.char;

      // Handle end of array
      if (index === characterTimings.length - 1) {
        words.push({
          text: currentWord,
          isHighlighted: currentWordStartIndex <= currentCharIndex && 
                        currentCharIndex <= index
        });
      }
    });

    return words.map((word, index) => (
      <span
        key={index}
        className={`${
          word.isHighlighted 
            ? 'bg-[#e6f3ff] dark:bg-blue-800' 
            : ''
        }`}
      >
        {word.text}
      </span>
    ));
  };

  // Clean up audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current?.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-sky-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          <div>
            <div className="text-sm opacity-90">{title}</div>
            <div className="text-lg font-medium truncate max-w-xs">
              {text.slice(0, 50)}...
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditToggle}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-sky-600 border border-white"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            className="w-full min-h-[200px] p-4 text-[17px] leading-[1.6] tracking-[0.01em] 
                     border rounded-lg resize-none focus:outline-none focus:ring-2 
                     focus:ring-sky-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter your text here..."
          />
        ) : (
          <div className="space-y-4">
            <p className="text-[17px] leading-[1.6] tracking-[0.01em] text-[#333333] dark:text-white">
              {renderText()}
            </p>
          </div>
        )}
      </div>

      {/* Player Controls - Only show when not editing */}
      {!isEditing && (
        <div className="border-t bg-white dark:bg-gray-900 p-4 space-y-2">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sky-500 transition-all duration-75"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          
          {/* Time and Controls */}
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-gray-500">
              {formatTime(currentTime)}
            </span>
            
            <div className="flex items-center space-x-4">
              <button className="p-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 17.035l-5-5 5-5v10.07zm2-10.07l5 5-5 5V6.965z" />
                </svg>
              </button>
              <button
                onClick={handleSpeak}
                disabled={loading || isPlaying}
                className="p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : isPlaying ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button className="p-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 6.965l5 5-5 5V6.965zm-2 10.07l-5-5 5-5v10.07z" />
                </svg>
              </button>
            </div>
            
            <span className="text-sm text-gray-500">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentCharIndex(-1);
        }}
        onPause={() => {
          setIsPlaying(false);
          setCurrentCharIndex(-1);
        }}
        className="hidden"
      />
    </div>
  );
} 