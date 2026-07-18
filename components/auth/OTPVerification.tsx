'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { signInWithCredential, PhoneAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface OTPVerificationProps {
  phone: string;
  name: string;
  verificationId: string;
  onBack: () => void;
}

export default function OTPVerification({
  phone,
  name,
  verificationId,
  onBack,
}: OTPVerificationProps) {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);

      const playerRef = doc(db, 'players', userCredential.user.uid);
      const playerSnap = await getDoc(playerRef);

      if (!playerSnap.exists()) {
        await setDoc(playerRef, {
          name,
          phone,
          createdAt: Timestamp.now(),
          lastPlayed: null,
          score: 0,
          coupon: '',
          reward: '',
        });
      }

      toast.success('✓ Welcome to Uncle\'s Chinese!');
      router.push('/');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-premium bg-white p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">✓ Verify OTP</h2>
        <p className="text-center text-gray-600">Enter the code sent to {phone}</p>
      </div>

      <input
        type="text"
        placeholder="000000"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
        maxLength={6}
        disabled={loading}
        className="w-full px-4 py-4 border-2 border-primary rounded-lg text-center text-3xl tracking-widest font-mono focus:outline-none focus:border-secondary text-primary disabled:opacity-50 transition-colors"
        autoFocus
      />

      <div className="space-y-3">
        <button
          onClick={handleVerifyOTP}
          disabled={loading || otp.length !== 6}
          className="w-full bg-gradient-to-r from-primary to-red-600 text-white py-3 rounded-lg font-bold button-hover disabled:opacity-50"
        >
          {loading ? '⏳ Verifying...' : '✓ Verify OTP'}
        </button>

        <button
          onClick={onBack}
          disabled={loading}
          className="w-full bg-gray-300 text-dark py-3 rounded-lg font-bold hover:bg-gray-400 transition-all disabled:opacity-50"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
