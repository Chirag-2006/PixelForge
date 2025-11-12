import Navbar from '@/components/Navbar';
import ImageGrid from '@/components/ImageGrid';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Image from '@/models/Image';

async function getUserProfile(userId) {
  try {
    await connectDB();
    
    const user = await User.findOne({ clerkId: userId }).lean();
    if (!user) {
      return null;
    }

    const images = await Image.find({ userId, public: true })
      .sort({ createdAt: -1 })
      .lean();

    return {
      user: JSON.parse(JSON.stringify(user)),
      images: JSON.parse(JSON.stringify(images)),
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export default async function ProfilePage({ params }) {
  const { id } = await params;
  const data = await getUserProfile(id);

  if (!data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">User Not Found</h1>
            <p className="text-gray-600">This user doesn&apos;t exist or hasn&apos;t published any images yet.</p>
          </div>
        </main>
      </div>
    );
  }

  const { user, images } = data;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}&apos;s Gallery</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500 mt-2">
            {images.length} published {images.length === 1 ? 'image' : 'images'}
          </p>
        </div>

        <ImageGrid images={images} showActions={false} />
      </main>
    </div>
  );
}
