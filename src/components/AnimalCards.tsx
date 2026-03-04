import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, Volume2, Loader2, Gift } from 'lucide-react';
import { generateImage, generateTTS, playPCM } from '../services/geminiService';

interface AnimalCardsProps {
  key?: string;
  onBack: () => void;
}

const ANIMALS = [
  { name: '小狗', prompt: 'A cute cartoon dog, simple, flat colors, white background, for toddlers' },
  { name: '小猫', prompt: 'A cute cartoon cat, simple, flat colors, white background, for toddlers' },
  { name: '小兔子', prompt: 'A cute cartoon rabbit, simple, flat colors, white background, for toddlers' },
  { name: '小鸭子', prompt: 'A cute cartoon duck, simple, flat colors, white background, for toddlers' },
  { name: '小猪', prompt: 'A cute cartoon pig, simple, flat colors, white background, for toddlers' },
  { name: '小马', prompt: 'A cute cartoon horse, simple, flat colors, white background, for toddlers' },
];

export default function AnimalCards({ onBack }: AnimalCardsProps) {
  const [currentAnimal, setCurrentAnimal] = useState<{ name: string, image: string, audio: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animalIndex, setAnimalIndex] = useState(0);

  const handleOpenBox = async () => {
    setIsLoading(true);
    try {
      const animal = ANIMALS[animalIndex % ANIMALS.length];
      
      // Generate image and TTS in parallel
      const [img, audio] = await Promise.all([
        generateImage(animal.prompt),
        generateTTS(`Say cheerfully: 看！这是一只可爱的${animal.name}！`)
      ]);
      
      setCurrentAnimal({ name: animal.name, image: img, audio });
      setAnimalIndex(i => i + 1);
      
      // Play audio automatically when it appears
      playPCM(audio);
    } catch (error) {
      console.error(error);
      alert('魔法盒子卡住了，请再试一次！');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (currentAnimal) {
      playPCM(currentAnimal.audio);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col min-h-screen bg-orange-50 p-4 md:p-8"
    >
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-full shadow-md text-orange-600 hover:bg-orange-100 transition-colors"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <h1 className="text-3xl font-bold text-orange-800 ml-4">动物世界</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!currentAnimal && !isLoading && (
            <motion.button
              key="box"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenBox}
              className="flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] shadow-2xl border-8 border-orange-200 cursor-pointer"
            >
              <Gift className="w-32 h-32 text-orange-500 mb-6" />
              <h2 className="text-3xl font-bold text-orange-800">打开魔法盒子！</h2>
            </motion.button>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] shadow-2xl border-8 border-orange-200"
            >
              <Loader2 className="w-32 h-32 text-orange-500 animate-spin mb-6" />
              <h2 className="text-3xl font-bold text-orange-800 animate-pulse">正在变出小动物...</h2>
            </motion.div>
          )}

          {currentAnimal && !isLoading && (
            <motion.div
              key="animal"
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-[3rem] shadow-2xl border-8 border-orange-200 w-full max-w-2xl"
            >
              <div className="relative w-full aspect-square max-h-[50vh] mb-8 rounded-3xl overflow-hidden border-4 border-orange-100">
                <img 
                  src={currentAnimal.image} 
                  alt={currentAnimal.name} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex items-center justify-between w-full px-4">
                <h2 className="text-5xl font-bold text-orange-800">{currentAnimal.name}</h2>
                <button 
                  onClick={handlePlayAudio}
                  className="p-6 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors active:scale-95 shadow-md"
                >
                  <Volume2 className="w-12 h-12" />
                </button>
              </div>

              <button
                onClick={handleOpenBox}
                className="mt-12 py-4 px-8 bg-orange-500 text-white rounded-full font-bold text-2xl hover:bg-orange-600 transition-colors active:scale-95 shadow-lg flex items-center"
              >
                <Sparkles className="w-8 h-8 mr-3" />
                再变一个！
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
