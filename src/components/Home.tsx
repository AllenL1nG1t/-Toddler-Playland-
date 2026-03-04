import React from 'react';
import { motion } from 'motion/react';
import { GameType } from '../types';
import { Sparkles, MousePointer2, Cat } from 'lucide-react';

interface HomeProps {
  key?: string;
  onSelectGame: (game: GameType) => void;
}

export default function Home({ onSelectGame }: HomeProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-screen bg-amber-50 p-6"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-amber-600 mb-12 text-center drop-shadow-sm font-sans">
        宝宝游乐园
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <GameCard 
          title="魔法画册" 
          description="变出神奇的图画！"
          icon={<Sparkles className="w-12 h-12 text-purple-500" />}
          color="bg-purple-100 border-purple-300 hover:bg-purple-200"
          onClick={() => onSelectGame('magic-book')}
        />
        
        <GameCard 
          title="点点气球" 
          description="戳破飞舞的气球！"
          icon={<MousePointer2 className="w-12 h-12 text-blue-500" />}
          color="bg-blue-100 border-blue-300 hover:bg-blue-200"
          onClick={() => onSelectGame('balloon-pop')}
        />
        
        <GameCard 
          title="动物世界" 
          description="认识可爱的小动物！"
          icon={<Cat className="w-12 h-12 text-orange-500" />}
          color="bg-orange-100 border-orange-300 hover:bg-orange-200"
          onClick={() => onSelectGame('animal-cards')}
        />
      </div>
    </motion.div>
  );
}

function GameCard({ title, description, icon, color, onClick }: { title: string, description: string, icon: React.ReactNode, color: string, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-8 rounded-3xl border-4 shadow-lg transition-colors ${color}`}
    >
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 text-center font-medium">{description}</p>
    </motion.button>
  );
}
