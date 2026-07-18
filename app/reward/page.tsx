'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import JSConfetti from 'js-confetti';
import toast from 'react-hot-toast';

interface RewardData {
  score: number;
  reward: string;
  couponCode: string;
}

export default function RewardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reward, setReward] = useState<RewardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ['🥟', '🎉', '🎁', '✨', '🏆'],
      confettiNumber: 50,
    });
  }, []);

  useEffect(() => {
    const fetchReward = async () => {
      if (!auth.currentUser) {
        router.push('/');
        return;
      }

      try {
        const score = searchParams.get('score');
        if (!score) {
          router.push('/');
          return;
        }

        const playerDoc = await getDoc(doc(db, 'players', auth.currentUser.uid));
        if (playerDoc.exists()) {
          const couponCode = playerDoc.data().coupon;
          const rewardType = playerDoc.data().reward;
          setReward({
            score: parseInt(score),
            reward: rewardType,
            couponCode: couponCode,
          });
        }
      } catch (error) {
        console.error('Error fetching reward:', error);
        toast.error('Error loading reward');
      } finally {
        setLoading(false);
      }
    };

    fetchReward();
  }, [router, searchParams]);

  const copyToClipboard = () => {
    if (reward?.couponCode) {
      navigator.clipboard.writeText(reward.couponCode);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!reward) {
    return (
      <div className="min-h-screen bg-accent flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-2xl text-dark">Error loading reward</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent via-accent to-secondary flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8 animate-bounce">
            <p className="text-7xl mb-4">🎉</p>
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text mb-2">
              Congratulations!
            </h1>
            <p className="text-xl text-dark font-semibold">You've won an amazing reward!</p>
          </div>

          <div className="card-premium bg-white p-8 space-y-6">
            {/* Score Display */}
            <div className="text-center bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
              <p className="text-sm opacity-90 mb-2">Your Final Score</p>
              <p className="text-6xl font-bold">{reward.score}</p>
              <p className="text-sm opacity-90 mt-2">points</p>
            </div>

            {/* Reward Card */}
            <div className="bg-gradient-to-r from-secondary to-yellow-300 rounded-2xl p-6 text-center shadow-lg">
              <p className="text-sm text-dark font-bold mb-1">🎁 YOUR REWARD</p>
              <p className="text-3xl font-bold text-primary">{reward.reward}</p>
            </div>

            {/* Coupon Code */}
            {reward.couponCode && (
              <div className="bg-gradient-to-br from-accent to-yellow-100 rounded-2xl p-6 text-center border-2 border-primary">
                <p className="text-xs text-dark font-bold mb-3 opacity-75">COUPON CODE</p>
                <div className="bg-white rounded-xl p-4 mb-4">
                  <p className="text-3xl font-mono font-bold text-primary tracking-widest">
                    {reward.couponCode}
                  </p>
                </div>
                <p className="text-xs text-dark opacity-70">Show this code at the restaurant</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={copyToClipboard}
                className="w-full bg-gradient-to-r from-primary to-red-600 text-white py-4 rounded-xl font-bold text-lg button-hover"
              >
                {copied ? '✓ Copied to Clipboard!' : '📋 Copy Coupon Code'}
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-dark text-accent py-4 rounded-xl font-bold text-lg button-hover"
              >
                ← Back Home
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
