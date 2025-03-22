'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  Home,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  RotateCcw
} from 'lucide-react';

export default function NotFound() {

  const dice = [
    <Dice1 width={32} height={32} />,
    <Dice2 width={32} height={32} />,
    <Dice3 width={32} height={32} />,
    <Dice4 width={32} height={32} />,
    <Dice5 width={32} height={32} />,
    <Dice6 width={32} height={32} />,
  ]

  const [diceIndex, setDiceIndex] = useState(Math.floor(Math.random() * 6));

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl font-bold text-yellow-400 mb-2">404</h1>
        <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-300 max-w-lg mx-auto">
          Looks like you've drawn a bad hand. The page you're looking for doesn't exist.
        </p>
      </motion.div>

      <motion.div
        className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-8 max-w-md w-full mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center justify-center mb-4 text-yellow-400 animate-bounce" onClick={() => {
          setDiceIndex(Math.floor(Math.random() * 6));
        }}>
          <div className='flex items-center justify-center'>
            {dice[diceIndex]}
          </div>
        </div>
        <h3 className="text-xl font-bold text-center mb-4">Want to try your luck again?</h3>

        <div className="space-y-4">
          <Link href="/" className="block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium flex items-center justify-center transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Leaderboard
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center justify-center transition-colors duration-200"
            onClick={() => window.history.back()}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Go Back
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="text-center text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} Poker Tournament Leaderboard
        </p>
      </motion.div>
    </div>
  );
}