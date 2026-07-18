'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AlreadyPlayedModal() {
  const router = useRouter();
  const [timeUntilMidnight, setTimeUntilMidnight] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilMidnight(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent via-accent to-secondary flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="max-w-md w-full card-premium bg-white p-8 text-center">
          <p className="text-6xl mb-6">😴</p>
          <h1 className="text-3xl font-bold text-primary mb-4">Come Back Tomorrow!</h1>
          <p className="text-lg text-dark mb-8 leading-relaxed">
            You have already played today. Come back tomorrow for another chance to win amazing rewards and climb the leaderboard!
          </p>
          <div className="bg-gradient-to-r from-secondary to-yellow-300 rounded-xl p-6 mb-8">
            <p className="text-sm text-dark font-bold mb-2">⏰ Next Play Available In:</p>
            <p className="text-3xl font-mono font-bold text-primary">{timeUntilMidnight}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-primary to-red-600 text-white py-3 rounded-lg font-bold button-hover"
          >
            ← Back Home
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
