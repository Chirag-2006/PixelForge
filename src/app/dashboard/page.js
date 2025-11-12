'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ImageGrid from '@/components/ImageGrid';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/images');
      if (res.ok) {
        const data = await res.json();
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const res = await fetch(`/api/images?id=${imageId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setImages(images.filter(img => img._id !== imageId));
        alert('Image deleted successfully');
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handlePublish = async (imageId) => {
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }),
      });

      if (res.ok) {
        // Update the local state
        setImages(images.map(img => 
          img._id === imageId ? { ...img, public: true } : img
        ));
        alert('Image published successfully!');
      } else {
        throw new Error('Failed to publish image');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your private and published images</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          </div>
        ) : (
          <ImageGrid
            images={images}
            showActions={true}
            onDelete={handleDelete}
            onPublish={handlePublish}
          />
        )}
      </main>
    </div>
  );
}
