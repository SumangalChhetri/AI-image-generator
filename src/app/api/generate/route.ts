import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const response = await fetch('https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt));

    if (!response.ok) {
      throw new Error('Image generation failed');
    }

    const imageUrl = response.url;

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error('Pollinations error:', error);
    return NextResponse.json({ error: 'Image generation failed.' }, { status: 500 });
  }
}
