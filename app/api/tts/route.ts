import { NextResponse } from 'next/server';
import { ElevenLabsClient } from 'elevenlabs';

console.log('API Key length:', process.env.ELEVENLABS_API_KEY?.length);

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
  baseUrl: "https://api.elevenlabs.io/v1"
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    // First, let's log the text we're trying to convert
    console.log('Converting text:', text);

    const response = await elevenlabs.textToSpeech.convertWithTimestamps(
      "21m00Tcm4TlvDq8ikWAM",  // Sarah's voice ID
      {
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }
    );

    // Log the response structure
    console.log('Response structure:', Object.keys(response));

    // Check if response has the expected properties
    if (!response || !response.audio_base64) {
      throw new Error('Invalid response from ElevenLabs API');
    }

    // Create character timing array with fallback
    const characterTimings = text.split('').map((char, index) => ({
      char,
      start: index * 0.1, // Fallback timing if no timestamps available
      end: (index + 1) * 0.1
    }));

    // If we have character timing data, use it
    if (response.characters && 
        response.character_start_times_seconds && 
        response.character_end_times_seconds) {
      characterTimings.length = 0; // Clear the array
      response.characters.forEach((char, index) => {
        characterTimings.push({
          char,
          start: response.character_start_times_seconds[index],
          end: response.character_end_times_seconds[index]
        });
      });
    }

    return NextResponse.json({
      audio: response.audio_base64,
      characterTimings
    });

  } catch (error) {
    console.error('TTS error:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }

    // Return a more informative error response
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'TTS processing failed',
      details: error
    }, { 
      status: 500 
    });
  }
} 