import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { audio, text } = await request.json();

    // Create audio directory if it doesn't exist
    const audioDir = path.join(process.cwd(), 'public', 'audio');
    await mkdir(audioDir, { recursive: true });

    // Create a filename based on text content hash
    const hash = Buffer.from(text).toString('base64').replace(/[/+=]/g, '_');
    const filename = `${hash}.mp3`;
    const filepath = path.join(audioDir, filename);

    // Save the audio file
    const audioBuffer = Buffer.from(audio, 'base64');
    await writeFile(filepath, audioBuffer);

    return NextResponse.json({ 
      success: true,
      audioUrl: `/audio/${filename}`,
    });

  } catch (error) {
    console.error('Save TTS error:', error);
    return NextResponse.json({ error: 'Failed to save audio file' }, { status: 500 });
  }
} 