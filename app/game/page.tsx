'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import GameCanvas from '@/components/GameCanvas';
import LoadingSpinner from '@/components/LoadingSpinner';
import AlreadyPlayedModal from '@/components/AlreadyPlayedModal';

export default function GamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [canPlay, setCanPlay] = useState(true);

  useEffect(() => {
    const checkPlayPermission = async () => {
      if (!auth.currentUser) {
        router.push('/');
        return;
      }

      try {
        const playerDoc = await getDoc(doc(db, 'players', auth.currentUser.uid));

        if (playerDoc.exists()) {
          const lastPlayed = playerDoc.data().lastPlayed?.toDate();
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (lastPlayed) {
            const lastPlayedDate = new Date(lastPlayed);
            lastPlayedDate.setHours(0, 0, 0, 0);

            if (lastPlayedDate.getTime() === today.getTime()) {
              setCanPlay(false);
            }
          }
        }
      } catch (error) {
        console.error('Error checking play permission:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPlayPermission();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!canPlay) {
    return <AlreadyPlayedModal />;
  }

  return <GameCanvas />;
}
