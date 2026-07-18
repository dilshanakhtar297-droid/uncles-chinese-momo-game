export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent via-accent to-secondary flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-6 animate-bounce">🥟</div>
        <div className="w-16 h-16 border-4 border-primary border-t-secondary rounded-full animate-spin mb-6"></div>
        <p className="text-xl text-primary font-bold">Loading your game...</p>
        <p className="text-sm text-gray-600 mt-2">Get ready to catch momos!</p>
      </div>
    </div>
  );
}
