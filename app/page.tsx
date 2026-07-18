'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import LandingPage from '@/components/LandingPage';
import AuthFlow from '@/components/AuthFlow';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(!!currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <LandingPage /> : <AuthFlow />;
}
