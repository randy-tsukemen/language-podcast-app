"use client";

import { useState } from 'react';
import TTSPlayer from './TTSPlayer';

interface TTSContainerProps {
  initialText: string;
  title: string;
}

export default function TTSContainer({ initialText, title }: TTSContainerProps) {
  const [text, setText] = useState(initialText);

  const handleTextChange = (newText: string) => {
    setText(newText);
    // Add any additional text change handling here
    console.log('Text changed:', newText);
  };

  return (
    <TTSPlayer 
      title={title}
      text={text}
      onTextChange={handleTextChange}
    />
  );
} 