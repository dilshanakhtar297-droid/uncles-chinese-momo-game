'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface NameInputProps {
  onNext: (name: string) => void;
}

export default function NameInput({ onNext }: NameInputProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onNext(name.trim());
      setLoading(false);
    }, 300);
  };

  return (
    <div className="card-premium bg-white p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">What's Your Name?</h2>
        <p className="text-center text-gray-600">Let us know who's playing!</p>
      </div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        disabled={loading}
        className="w-full px-4 py-3 border-2 border-primary rounded-lg focus:outline-none focus:border-secondary text-dark font-semibold disabled:opacity-50 transition-colors"
        autoFocus
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary to-red-600 text-white py-3 rounded-lg font-bold button-hover disabled:opacity-50"
      >
        {loading ? '⏳ Loading...' : '▶️ Continue'}
      </button>
    </div>
  );
}
