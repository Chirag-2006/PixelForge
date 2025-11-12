import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Image from '@/models/Image';

// GET - Fetch user's images
export async function GET(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const images = await Image.find({ userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

// POST - Save a new image
export async function POST(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, imageUrl, isPublic = false } = await req.json();

    if (!prompt || !imageUrl) {
      return NextResponse.json({ error: 'Prompt and imageUrl are required' }, { status: 400 });
    }

    await connectDB();

    // Create the image
    const image = await Image.create({
      userId,
      prompt,
      imageUrl,
      public: isPublic,
    });

    // Increment user's image count
    await User.findOneAndUpdate(
      { clerkId: userId },
      { $inc: { imageCount: 1 } }
    );

    return NextResponse.json({ 
      message: 'Image saved successfully',
      image 
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}

// DELETE - Delete an image
export async function DELETE(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    await connectDB();

    // Check if image belongs to user
    const image = await Image.findOne({ _id: imageId, userId });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await Image.deleteOne({ _id: imageId });

    // Decrement user's image count
    await User.findOneAndUpdate(
      { clerkId: userId },
      { $inc: { imageCount: -1 } }
    );

    return NextResponse.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
