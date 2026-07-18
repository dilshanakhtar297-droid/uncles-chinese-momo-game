'use client';

import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import RewardCard from './RewardCard';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent via-accent to-secondary flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <section className="text-center py-8 md:py-16">
          <div className="mb-6 inline-block">
            <div className="text-7xl md:text-8xl animate-bounce">🥟</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-gradient-to-r from-primary to-red-600 bg-clip-text mb-4">
            Catch the Momo Challenge
          </h1>
          <p className="text-xl md:text-2xl text-dark mb-8 font-semibold leading-relaxed">
            Catch fresh momos.<br />
            Win exciting rewards.<br />
            Play once every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/game')}
              className="bg-gradient-to-r from-primary to-red-600 text-accent px-8 py-4 rounded-lg font-bold text-lg button-hover shadow-xl"
            >
              ▶️ Play Now
            </button>
            <button
              onClick={() => router.push('/leaderboard')}
              className="bg-secondary text-dark px-8 py-4 rounded-lg font-bold text-lg button-hover shadow-xl"
            >
              🏆 Leaderboard
            </button>
          </div>
        </section>

        {/* Rewards Section */}
        <section className="py-12 md:py-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-12">
            🎁 Win Amazing Rewards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RewardCard score="100-199" reward="10% OFF" icon="🎟️" />
            <RewardCard score="200-299" reward="₹50 OFF" icon="💳" />
            <RewardCard score="300-449" reward="₹100 OFF" icon="💰" />
            <RewardCard score="450+" reward="Free 6 Piece Momos" icon="🎉" />
          </div>
        </section>

        {/* How to Play Section */}
        <section className="py-12 md:py-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-12">
            📋 How to Play
          </h2>
          <div className="max-w-3xl mx-auto card-premium bg-white p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">1️⃣</span>
                <div>
                  <h3 className="font-bold text-xl text-primary mb-1">One Play Per Day</h3>
                  <p className="text-dark text-lg">Each phone number can play once every 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">2️⃣</span>
                <div>
                  <h3 className="font-bold text-xl text-primary mb-1">60 Second Challenge</h3>
                  <p className="text-dark text-lg">Catch momos to increase your score before time runs out</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">3️⃣</span>
                <div>
                  <h3 className="font-bold text-xl text-primary mb-1">Instant Rewards</h3>
                  <p className="text-dark text-lg">Get your coupon code immediately after the game ends</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">4️⃣</span>
                <div>
                  <h3 className="font-bold text-xl text-primary mb-1">Automatic Generation</h3>
                  <p className="text-dark text-lg">Rewards are generated based on your score automatically</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Game Items Section */}
        <section className="py-12 md:py-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-12">
            🎮 Game Items
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            <div className="card-premium text-center bg-white p-4">
              <p className="text-4xl mb-2">🥟</p>
              <p className="font-bold text-lg">Veg Momo</p>
              <p className="text-sm text-primary font-bold">+10</p>
            </div>
            <div className="card-premium text-center bg-white p-4">
              <p className="text-4xl mb-2">🍖</p>
              <p className="font-bold text-lg">Chicken Momo</p>
              <p className="text-sm text-primary font-bold">+15</p>
            </div>
            <div className="card-premium text-center bg-white p-4 golden-glow">
              <p className="text-4xl mb-2">✨</p>
              <p className="font-bold text-lg">Golden Momo</p>
              <p className="text-sm text-primary font-bold">+50</p>
            </div>
            <div className="card-premium text-center bg-white p-4">
              <p className="text-4xl mb-2">🍌</p>
              <p className="font-bold text-lg">Burnt Momo</p>
              <p className="text-sm text-red-500 font-bold">-10</p>
            </div>
            <div className="card-premium text-center bg-white p-4">
              <p className="text-4xl mb-2">💥</p>
              <p className="font-bold text-lg">Chili Bomb</p>
              <p className="text-sm text-red-500 font-bold">-20</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
