import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET - Fetch current user's details
export async function GET(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let user = await User.findOne({ clerkId: userId });

    // Create user if doesn't exist
    if (!user) {
      const clerkUser = await currentUser();
      user = await User.create({
        clerkId: userId,
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        email: clerkUser.emailAddresses[0].emailAddress,
      });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
