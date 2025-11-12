'use client';

import Link from 'next/link';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <span className="font-bold text-xl text-gray-900">PixelForge</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Link href="/create">
                <Button variant="default">Create</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
