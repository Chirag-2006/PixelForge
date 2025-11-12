import Navbar from "@/components/Navbar";
import ImageGrid from "@/components/ImageGrid";
import { currentUser } from "@clerk/nextjs/server";
import PromptInput from "@/components/PromptInput";

async function getPublicImages() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/public-images`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.images || [];
  } catch (error) {
    console.error("Error fetching public images:", error);
    return [];
  }
}

export default async function Home() {
  const user = await currentUser();
  const images = await getPublicImages();

  // console.log("user", user);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing AI Art
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore stunning images created by our community using AI. Sign in
            to start creating your own masterpieces!
          </p>

          {!user && <PromptInput />}
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              No public images yet. Be the first to create and publish!
            </p>
          </div>
        ) : (
          <ImageGrid images={images} showActions={false} />
        )}
      </main>
    </div>
  );
}
