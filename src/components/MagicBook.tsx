import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Wand2, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { generateImage, editImage } from '../services/geminiService';

interface MagicBookProps {
  key?: string;
  onBack: () => void;
}

const PRESET_GENERATIONS = [
  { label: '🐶 小狗', prompt: 'A cute cartoon dog, simple, flat colors, white background, for toddlers' },
  { label: '🐱 小猫', prompt: 'A cute cartoon cat, simple, flat colors, white background, for toddlers' },
  { label: '🚗 汽车', prompt: 'A cute cartoon car, simple, flat colors, white background, for toddlers' },
  { label: '🍎 苹果', prompt: 'A cute cartoon apple, simple, flat colors, white background, for toddlers' },
];

const PRESET_EDITS = [
  { label: '🎩 戴帽子', prompt: 'Add a cute hat to the main subject' },
  { label: '🕶️ 戴墨镜', prompt: 'Add cool sunglasses to the main subject' },
  { label: '🎈 拿气球', prompt: 'Make the main subject hold a red balloon' },
  { label: '✨ 变魔法', prompt: 'Add magical sparkles around the subject' },
];

export default function MagicBook({ onBack }: MagicBookProps) {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      const img = await generateImage(prompt);
      setCurrentImage(img);
    } catch (error) {
      console.error(error);
      alert('生成失败了，请再试一次！');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (prompt: string) => {
    if (!currentImage) return;
    setIsLoading(true);
    try {
      const img = await editImage(currentImage, prompt);
      setCurrentImage(img);
    } catch (error) {
      console.error(error);
      alert('修改失败了，请再试一次！');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col min-h-screen bg-purple-50 p-4 md:p-8"
    >
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-full shadow-md text-purple-600 hover:bg-purple-100 transition-colors"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <h1 className="text-3xl font-bold text-purple-800 ml-4">魔法画册</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto w-full">
        {/* Image Display Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border-8 border-purple-200 overflow-hidden flex items-center justify-center min-h-[400px] md:min-h-[500px] relative">
          {isLoading ? (
            <div className="flex flex-col items-center text-purple-500">
              <Loader2 className="w-16 h-16 animate-spin mb-4" />
              <p className="text-xl font-bold animate-pulse">魔法正在施展...</p>
            </div>
          ) : currentImage ? (
            <img src={currentImage} alt="Magic generation" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex flex-col items-center text-purple-300">
              <ImageIcon className="w-24 h-24 mb-4 opacity-50" />
              <p className="text-2xl font-bold">点击按钮变出图画吧！</p>
            </div>
          )}
        </div>

        {/* Controls Area */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-md border-4 border-purple-100">
            <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
              <Wand2 className="w-6 h-6 mr-2" /> 变出新东西
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_GENERATIONS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleGenerate(preset.prompt)}
                  disabled={isLoading}
                  className="py-3 px-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl font-bold text-lg transition-transform active:scale-95 disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`bg-white p-6 rounded-3xl shadow-md border-4 border-pink-100 transition-opacity ${!currentImage ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="text-xl font-bold text-pink-800 mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-2" /> 施加魔法
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_EDITS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleEdit(preset.prompt)}
                  disabled={isLoading || !currentImage}
                  className="py-3 px-2 bg-pink-100 hover:bg-pink-200 text-pink-800 rounded-xl font-bold text-lg transition-transform active:scale-95 disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Parent Input Area */}
          <div className="bg-white p-6 rounded-3xl shadow-md border-4 border-blue-100">
            <h2 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">家长输入区</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="输入你想生成的画面..."
                className="flex-1 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customPrompt) {
                    currentImage ? handleEdit(customPrompt) : handleGenerate(customPrompt);
                    setCustomPrompt('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (customPrompt) {
                    currentImage ? handleEdit(customPrompt) : handleGenerate(customPrompt);
                    setCustomPrompt('');
                  }
                }}
                disabled={isLoading || !customPrompt}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
