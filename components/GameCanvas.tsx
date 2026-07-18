'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import {
  doc,
  updateDoc,
  setDoc,
  Timestamp,
  collection,
  addDoc,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const Phaser = dynamic(() => import('phaser'), { ssr: false });

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const handleGameComplete = async (finalScore: number) => {
      if (!auth.currentUser) return;

      try {
        let reward = '';

        if (finalScore >= 450) {
          reward = 'Free 6 Piece Momos';
        } else if (finalScore >= 300) {
          reward = '₹100 OFF';
        } else if (finalScore >= 200) {
          reward = '₹50 OFF';
        } else if (finalScore >= 100) {
          reward = '10% OFF';
        } else {
          reward = 'Better luck next time!';
        }

        const couponCode = `UC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

        const playerRef = doc(db, 'players', auth.currentUser.uid);
        await updateDoc(playerRef, {
          lastPlayed: Timestamp.now(),
          score: finalScore,
          coupon: couponCode,
          reward,
        });

        if (reward !== 'Better luck next time!') {
          await addDoc(collection(db, 'coupons'), {
            couponCode,
            reward,
            redeemed: false,
            playerId: auth.currentUser.uid,
            playerName: auth.currentUser.displayName || 'Anonymous',
            createdAt: Timestamp.now(),
          });
        }

        await addDoc(collection(db, 'leaderboard'), {
          name: auth.currentUser.displayName || 'Anonymous',
          score: finalScore,
          playerId: auth.currentUser.uid,
          date: Timestamp.now(),
        });

        window.location.href = `/reward?score=${finalScore}`;
      } catch (error) {
        console.error('Error saving game result:', error);
        toast.error('Error saving your score. Please try again.');
      }
    };

    let gameConfig: any = {};

    const initializeGame = async () => {
      const { default: Phaser } = await import('phaser');
      const { default: GameScene } = await import('@/lib/phaser/GameScene');

      gameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight - 60,
        parent: containerRef.current,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 300 },
            debug: false,
          },
        },
        scene: GameScene,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        audio: {
          disableWebAudio: false,
        },
      };

      gameRef.current = new Phaser.Game(gameConfig);

      window.addEventListener('gameComplete', ((e: any) => {
        handleGameComplete(e.detail.score);
      }) as EventListener);
    };

    initializeGame();

    const handleWindowResize = () => {
      if (gameRef.current) {
        gameRef.current.scale.resize(window.innerWidth, window.innerHeight - 60);
      }
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
