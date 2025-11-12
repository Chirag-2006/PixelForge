import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Image from '@/models/Image';

// GET - Fetch all public images
export async function GET(req) {
  try {
    await connectDB();

    const images = await Image.find({ public: true })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to 50 most recent
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching public images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
