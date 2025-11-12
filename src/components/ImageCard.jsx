'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Share2 } from 'lucide-react';

export default function ImageCard({ 
  image, 
  showActions = false, 
  onDelete, 
  onPublish 
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={image.imageUrl}
            alt={image.prompt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4 space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">{image.prompt}</p>
        
        {showActions && (
          <div className="flex gap-2 w-full">
            {!image.public && (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => onPublish(image._id)}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Publish
              </Button>
            )}
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => onDelete(image._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {!showActions && image.userId && (
          <Link 
            href={`/profile/${image.userId}`}
            className="text-xs text-purple-600 hover:underline"
          >
            View Creator
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
