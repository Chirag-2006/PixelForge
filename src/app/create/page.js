'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UpgradeModal from '@/components/UpgradeModal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Download, Save, Share2 } from 'lucide-react';
import Image from 'next/image';

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.status === 403 && data.limitReached) {
        setShowUpgradeModal(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage(data.imageUrl);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isPublic = false) => {
    if (!generatedImage) return;

    setSaving(true);

    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageUrl: generatedImage,
          isPublic,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save image');
      }

      alert(isPublic ? 'Image published successfully!' : 'Image saved successfully!');
      
      // Refresh user data
      await fetchUser();
      
      // Clear the form
      setPrompt('');
      setGeneratedImage(null);

      // Redirect to dashboard
      if (!isPublic) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create AI Image</h1>
          {user && (
            <p className="text-gray-600">
              Images generated: <span className="font-semibold">{user.imageCount}</span> / {user.plan === 'free' ? '5' : '∞'}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your image
              </label>
              <Textarea
                placeholder="A futuristic city at sunset with flying cars..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[150px]"
                disabled={loading || saving}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || saving || !prompt.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Image'
              )}
            </Button>

            {generatedImage && (
              <div className="space-y-2">
                <Button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  variant="outline"
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save (Private)
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="w-full"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Publish (Public)
                </Button>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div>
            <label className="block text-sm font-medium mb-2">Preview</label>
            <Card className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              {loading ? (
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">Creating your masterpiece...</p>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={generatedImage}
                    alt={prompt}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <p className="text-gray-400">Your generated image will appear here</p>
              )}
            </Card>
          </div>
        </div>
      </main>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </div>
  );
}
