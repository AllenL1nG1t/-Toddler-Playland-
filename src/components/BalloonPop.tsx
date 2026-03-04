import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Target } from 'lucide-react';

interface BalloonPopProps {
  key?: string;
  onBack: () => void;
}

interface Balloon {
  id: number;
  x: number;
  color: string;
  speed: number;
  size: number;
}

const COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 
  'bg-yellow-400', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'
];

export default function BalloonPop({ onBack }: BalloonPopProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    // Spawn balloons periodically
    const interval = setInterval(() => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const newBalloon: Balloon = {
          id: nextId.current++,
          x: Math.random() * (width - 80) + 40, // Avoid edges
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          speed: Math.random() * 3 + 2, // 2 to 5 seconds to reach top
          size: Math.random() * 40 + 60, // 60px to 100px
        };
        setBalloons(prev => [...prev, newBalloon]);
      }
    }, 1000); // Spawn every second

    return () => clearInterval(interval);
  }, []);

  const handlePop = (id: number) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
    
    // Play pop sound (simple oscillator)
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Ignore audio errors
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col h-screen bg-blue-50 overflow-hidden relative"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex justify-between items-center z-10 pointer-events-none">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-100 transition-colors pointer-events-auto"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        
        <div className="bg-white px-6 py-3 rounded-full shadow-lg border-4 border-blue-200 flex items-center">
          <Target className="w-8 h-8 text-red-500 mr-3" />
          <span className="text-4xl font-bold text-blue-800 font-mono">{score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <AnimatePresence>
          {balloons.map(balloon => (
            <motion.div
              key={balloon.id}
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ y: '-20vh', opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: balloon.speed, ease: 'linear' }}
              onAnimationComplete={() => {
                // Remove balloon if it reaches the top without being popped
                setBalloons(prev => prev.filter(b => b.id !== balloon.id));
              }}
              className="absolute cursor-pointer touch-none"
              style={{ left: balloon.x, width: balloon.size, height: balloon.size * 1.2 }}
              onPointerDown={() => handlePop(balloon.id)}
            >
              {/* Balloon Shape */}
              <div className={`w-full h-full rounded-[50%] ${balloon.color} shadow-inner relative`}>
                {/* Highlight */}
                <div className="absolute top-[10%] left-[20%] w-[20%] h-[30%] bg-white/30 rounded-full rotate-[-30deg]"></div>
                {/* Knot */}
                <div className={`absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[20%] h-[15%] ${balloon.color} rounded-b-full`}></div>
                {/* String */}
                <div className="absolute top-[105%] left-1/2 w-[2px] h-[50px] bg-gray-400/50 origin-top rotate-[-10deg]"></div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
