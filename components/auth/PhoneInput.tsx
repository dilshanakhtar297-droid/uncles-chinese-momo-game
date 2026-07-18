'use client';

import { useState } from 'react';
import { auth } from '@/firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import toast from 'react-hot-toast';

interface PhoneInputProps {
  name: string;
  onBack: () => void;
  onPhoneSubmitted: (phone: string, verificationId: string) => void;
}

export default function PhoneInput({
  name,
  onBack,
  onPhoneSubmitted,
}: PhoneInputProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      let verifier = recaptchaVerifier;
      if (!verifier) {
        verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
        setRecaptchaVerifier(verifier);
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        verifier
      );
      toast.success('✓ OTP sent successfully!');
      onPhoneSubmitted(phone, (confirmationResult as any).verificationId);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
      console.error(error);
      setRecaptchaVerifier(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-premium bg-white p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">📞 Enter Phone Number</h2>
        <p className="text-center text-gray-600">Hey {name}! We'll send you an OTP</p>
      </div>

      <input
        type="tel"
        placeholder="+1 (555) 123-4567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
        disabled={loading}
        className="w-full px-4 py-3 border-2 border-primary rounded-lg focus:outline-none focus:border-secondary text-dark font-semibold disabled:opacity-50 transition-colors"
        autoFocus
      />

      <div id="recaptcha-container" className="flex justify-center"></div>

      <div className="space-y-3">
        <button
          onClick={handleSendOTP}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-red-600 text-white py-3 rounded-lg font-bold button-hover disabled:opacity-50"
        >
          {loading ? '📤 Sending OTP...' : '📤 Send OTP'}
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
