'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-primary to-red-700 text-accent sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <span className="text-3xl">🥟</span>
          <div>
            <p className="font-bold text-xl leading-tight">Uncle's Chinese</p>
            <p className="text-xs opacity-90">Momo Festival</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="hover:text-secondary transition-colors font-semibold text-lg"
          >
            Home
          </Link>
          <Link
            href="/leaderboard"
            className="hover:text-secondary transition-colors font-semibold text-lg"
          >
            🏆 Leaderboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-secondary text-primary px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg"
          >
            Logout
          </button>
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-dark bg-opacity-95 p-4 flex flex-col gap-4">
          <Link href="/" className="hover:text-secondary transition-colors font-semibold">
            Home
          </Link>
          <Link href="/leaderboard" className="hover:text-secondary transition-colors font-semibold">
            🏆 Leaderboard
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-secondary text-primary px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
