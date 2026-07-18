interface RewardCardProps {
  score: string;
  reward: string;
  icon: string;
}

export default function RewardCard({ score, reward, icon }: RewardCardProps) {
  return (
    <div className="card-premium bg-white p-6 text-center border-t-4 border-primary hover:border-secondary group">
      <p className="text-5xl mb-4 group-hover:scale-110 transition-transform">{icon}</p>
      <p className="text-xs text-gray-600 font-bold mb-1">SCORE RANGE</p>
      <p className="text-2xl font-bold text-primary mb-4">{score}</p>
      <div className="bg-gradient-to-r from-primary to-red-600 text-white py-3 rounded-lg">
        <p className="font-bold text-lg">{reward}</p>
      </div>
    </div>
  );
}
