'use client';

import Link from 'next/link';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus } from 'lucide-react';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 🔹 Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
          <span className="font-bold text-lg md:text-xl text-gray-900">PixelForge</span>
        </Link>

        {/* 🔹 Right Side Actions */}
        <div className="flex items-center gap-2 md:space-x-3">
          {isSignedIn ? (
            <>
              {/* Desktop: Full Create Button */}
              <Link href="/create" className="hidden md:block">
                <Button variant="default">Create</Button>
              </Link>

              {/* Mobile: Icon Only (Plus) */}
              <Link href="/create" className="block md:hidden">
                <Button size="icon" variant="default" className="rounded-full">
                  <Plus className="h-5 w-5" />
                </Button>
              </Link>

              {/* Dashboard Button (same on all devices) */}
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className=" sm:block">
                  Dashboard
                </Button>
              </Link>

              {/* User Avatar (always visible) */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'h-9 w-9',
                  },
                }}
              />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
