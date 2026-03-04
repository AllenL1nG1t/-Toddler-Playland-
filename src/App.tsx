/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Home from './components/Home';
import MagicBook from './components/MagicBook';
import BalloonPop from './components/BalloonPop';
import AnimalCards from './components/AnimalCards';
import { GameType } from './types';

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('home');

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {currentGame === 'home' && (
          <Home key="home" onSelectGame={setCurrentGame} />
        )}
        {currentGame === 'magic-book' && (
          <MagicBook key="magic-book" onBack={() => setCurrentGame('home')} />
        )}
        {currentGame === 'balloon-pop' && (
          <BalloonPop key="balloon-pop" onBack={() => setCurrentGame('home')} />
        )}
        {currentGame === 'animal-cards' && (
          <AnimalCards key="animal-cards" onBack={() => setCurrentGame('home')} />
        )}
      </AnimatePresence>
    </div>
  );
}
