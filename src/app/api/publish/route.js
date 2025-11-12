import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Image from '@/models/Image';

// POST - Publish an image
export async function POST(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageId } = await req.json();

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    await connectDB();

    // Check if image belongs to user
    const image = await Image.findOne({ _id: imageId, userId });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Update image to public
    image.public = true;
    await image.save();

    return NextResponse.json({ 
      message: 'Image published successfully',
      image 
    });

  } catch (error) {
    console.error('Error publishing image:', error);
    return NextResponse.json({ error: 'Failed to publish image' }, { status: 500 });
  }
}
