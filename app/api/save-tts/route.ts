import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { audio, text } = await request.json();

    // Create audio directory if it doesn't exist
    const audioDir = path.join(process.cwd(), 'public', 'audio');
    try {
      await mkdir(audioDir, { recursive: true });
    } catch (err) {
      console.error('Error creating directory:', err);
    }

    // Create a shorter filename using MD5 hash
    const hash = crypto
      .createHash('md5')
      .update(text)
      .digest('hex');
    const filename = `${hash}.mp3`;
    const filepath = path.join(audioDir, filename);

    try {
      // Save the audio file
      const audioBuffer = Buffer.from(audio, 'base64');
      await writeFile(filepath, audioBuffer);

      return NextResponse.json({ 
        success: true,
        audioUrl: `/audio/${filename}`,
      });
    } catch (err) {
      console.error('Error writing file:', err);
      throw new Error('Failed to write audio file');
    }

  } catch (error) {
    console.error('Save TTS error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to save audio file' 
    }, { 
      status: 500 
    });
  }
} 