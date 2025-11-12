'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function UpgradeModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            You&apos;ve reached the free plan limit of 5 images. Upgrade to Pro for unlimited image generation!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Pro Plan Benefits</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="text-purple-600 mr-2">✓</span>
                Unlimited image generation
              </li>
              <li className="flex items-center">
                <span className="text-purple-600 mr-2">✓</span>
                Priority processing
              </li>
              <li className="flex items-center">
                <span className="text-purple-600 mr-2">✓</span>
                High resolution downloads
              </li>
              <li className="flex items-center">
                <span className="text-purple-600 mr-2">✓</span>
                Early access to new features
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Upgrade Now - $9.99/month
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
