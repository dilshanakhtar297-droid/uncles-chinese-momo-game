'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  Timestamp,
} from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const q = query(
          collection(db, 'leaderboard'),
          where('date', '>=', Timestamp.fromDate(today)),
          where('date', '<', Timestamp.fromDate(tomorrow)),
          orderBy('date', 'desc'),
          orderBy('score', 'desc'),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const entries: LeaderboardEntry[] = [];

        querySnapshot.forEach((doc, index) => {
          entries.push({
            id: doc.id,
            name: doc.data().name,
            score: doc.data().score,
            rank: index + 1,
          });
        });

        setLeaderboard(entries);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent via-accent to-secondary flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-2">🏆 Daily Leaderboard</h1>
          <p className="text-lg text-dark opacity-80">Top 10 Players Today</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : leaderboard.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            <div className="grid gap-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.id}
                  className="card-premium bg-white p-5 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text w-12 text-center">
                      {entry.rank === 1 && '🥇'}
                      {entry.rank === 2 && '🥈'}
                      {entry.rank === 3 && '🥉'}
                      {entry.rank > 3 && entry.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-dark group-hover:text-primary transition-colors">{entry.name}</p>
                      <p className="text-sm text-gray-500">#{entry.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                      {entry.score}
                    </p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-3xl mb-4">🎮</p>
            <p className="text-xl text-dark font-semibold">No scores yet</p>
            <p className="text-lg text-gray-600 mt-2">Be the first to play and claim the top spot!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
