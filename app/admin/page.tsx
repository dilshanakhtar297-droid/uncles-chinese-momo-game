'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/firebase/config';
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

interface AdminStats {
  totalPlayers: number;
  todayPlayers: number;
  couponsGenerated: number;
  couponsRedeemed: number;
}

interface Coupon {
  id: string;
  code: string;
  reward: string;
  redeemed: boolean;
  playerName: string;
  playerId: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<AdminStats>({
    totalPlayers: 0,
    todayPlayers: 0,
    couponsGenerated: 0,
    couponsRedeemed: 0,
  });
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setAuthenticated(true);
      fetchStats();
    }
  }, []);

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch('/api/auth/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthenticated(true);
        fetchStats();
        setPassword('');
        toast.success('Admin access granted');
      } else {
        toast.error('Invalid password');
        setPassword('');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed');
      setPassword('');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const playersSnap = await getDocs(collection(db, 'players'));
      const totalPlayers = playersSnap.size;

      const todayPlayersSnap = await getDocs(
        query(
          collection(db, 'players'),
          where('lastPlayed', '>=', Timestamp.fromDate(today)),
          where('lastPlayed', '<', Timestamp.fromDate(tomorrow))
        )
      );
      const todayPlayers = todayPlayersSnap.size;

      const couponsSnap = await getDocs(collection(db, 'coupons'));
      let couponsGenerated = 0;
      let couponsRedeemed = 0;
      const couponsList: Coupon[] = [];

      couponsSnap.forEach((doc) => {
        couponsGenerated++;
        if (doc.data().redeemed) {
          couponsRedeemed++;
        }
        couponsList.push({
          id: doc.id,
          code: doc.data().couponCode,
          reward: doc.data().reward,
          redeemed: doc.data().redeemed,
          playerName: doc.data().playerName,
          playerId: doc.data().playerId,
        });
      });

      setStats({
        totalPlayers,
        todayPlayers,
        couponsGenerated,
        couponsRedeemed,
      });
      setCoupons(couponsList.reverse());
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  const markAsRedeemed = async (couponId: string) => {
    try {
      await updateDoc(doc(db, 'coupons', couponId), {
        redeemed: true,
      });
      toast.success('Coupon marked as redeemed');
      fetchStats();
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error('Error updating coupon');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent via-accent to-secondary flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="max-w-md w-full card-premium bg-white p-8 space-y-6">
            <div className="text-center">
              <p className="text-5xl mb-4">🔐</p>
              <h1 className="text-3xl font-bold text-primary mb-2">Admin Login</h1>
              <p className="text-gray-600">Enter admin password to continue</p>
            </div>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              className="w-full px-4 py-3 border-2 border-primary rounded-lg focus:outline-none focus:border-secondary text-dark font-semibold"
              autoFocus
            />
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-gradient-to-r from-primary to-red-600 text-white py-3 rounded-lg font-bold button-hover"
            >
              🔓 Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent via-accent to-secondary flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-primary to-red-600 bg-clip-text mb-2">
            📊 Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage game, players, and coupons</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-premium bg-white p-6 text-center border-t-4 border-primary">
            <p className="text-gray-600 text-sm font-bold mb-2">👥 TOTAL PLAYERS</p>
            <p className="text-5xl font-bold text-primary">{stats.totalPlayers}</p>
          </div>
          <div className="card-premium bg-white p-6 text-center border-t-4 border-secondary">
            <p className="text-gray-600 text-sm font-bold mb-2">📅 TODAY'S PLAYERS</p>
            <p className="text-5xl font-bold text-secondary">{stats.todayPlayers}</p>
          </div>
          <div className="card-premium bg-white p-6 text-center border-t-4 border-accent">
            <p className="text-gray-600 text-sm font-bold mb-2">🎟️ COUPONS GENERATED</p>
            <p className="text-5xl font-bold text-dark">{stats.couponsGenerated}</p>
          </div>
          <div className="card-premium bg-white p-6 text-center border-t-4 border-primary">
            <p className="text-gray-600 text-sm font-bold mb-2">✅ COUPONS REDEEMED</p>
            <p className="text-5xl font-bold text-primary">{stats.couponsRedeemed}</p>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="card-premium bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-primary">🎁 Coupons</h2>
            <button
              onClick={fetchStats}
              className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all"
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading coupons...</p>
            </div>
          ) : coupons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left py-3 px-4 font-bold text-primary">Code</th>
                    <th className="text-left py-3 px-4 font-bold text-primary">Reward</th>
                    <th className="text-left py-3 px-4 font-bold text-primary">Player</th>
                    <th className="text-left py-3 px-4 font-bold text-primary">Status</th>
                    <th className="text-left py-3 px-4 font-bold text-primary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b hover:bg-accent transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">{coupon.code}</td>
                      <td className="py-3 px-4 font-semibold text-dark">{coupon.reward}</td>
                      <td className="py-3 px-4 text-dark">{coupon.playerName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            coupon.redeemed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {coupon.redeemed ? '✅ Redeemed' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {!coupon.redeemed && (
                          <button
                            onClick={() => markAsRedeemed(coupon.id)}
                            className="bg-primary text-white px-4 py-1 rounded font-bold hover:bg-opacity-90 transition-all"
                          >
                            ✓ Mark Redeemed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No coupons generated yet</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
