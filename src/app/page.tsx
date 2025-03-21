'use client';

// pages/index.js
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface Player {
  id: number;
  name: string;
  winnings: number;
  tournaments: number;
  country: string;
  quote: string;
}

export default function Home() {
  const players: Player[] = [
    { id: 1, name: "Rufus \"Dizzy\" Hannah", winnings: 2000, tournaments: 0, country: "UK", quote: "Nothing gets past the treasurer." },
    { id: 2, name: "Joseph Reece", winnings: 20, tournaments: 1, country: "UK", quote: "I\'d rather punt big than win small." },
    { id: 3, name: "Ben Williamson", winnings: -100, tournaments: 0, country: "UK", quote: "Sometimes you have to lose it all to win big." },
    { id: 4, name: "Max Lord", winnings: 5000, tournaments: 0, country: "UK", quote: "Luke, can I borrow your girl for the weeknd?" },
    { id: 5, name: "Josh \"Spence\" Spencer", winnings: 400, tournaments: 0, country: "UK", quote: "Is it 4 in the morning already? Yeah, let's keep going." },
    { id: 6, name: "Daron Leipjan", winnings: 5, tournaments: 0, country: "UK", quote: "BAAAAAAAAD BEATTTTTTT." },
    { id: 7, name: "Connor Sandbrook", winnings: 1000, tournaments: 4, country: "UK", quote: "Gobble gobble." },
    { id: 8, name: "Jason", winnings: 10000, tournaments: 2, country: "UK", quote: "Who has cash box?" },
    { id: 9, name: "Josh \"Thwait\" Micklethwait", winnings: 300, tournaments: 0, country: "UK", quote: "Fold when uncertain, fold when confident." },
  ];

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Player;
    direction: 'descending' | 'ascending';
  }>({
    key: 'winnings',
    direction: 'descending'
  });

  // Filter state
  const [filterValue, setFilterValue] = useState('');

  // Expanded row state
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Function to sort the players
  const sortedPlayers = [...players].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  // Function to filter players
  const filteredPlayers = sortedPlayers.filter(player =>
    player.name.toLowerCase().includes(filterValue.toLowerCase()) ||
    player.country.toLowerCase().includes(filterValue.toLowerCase()) ||
    player.quote.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Function to request sorting
  const requestSort = (key: keyof Player) => {
    let direction: 'descending' | 'ascending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Function to toggle row expansion
  const toggleRowExpansion = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Animation variants for the squash effect
  const rowVariants = {
    initial: {
      opacity: 0,
      height: 0,
      scaleY: 0.6,
      transformOrigin: "center"
    },
    animate: {
      opacity: 1,
      height: "auto",
      scaleY: 1,
      transition: {
        height: { duration: 0.3 },
        scaleY: { duration: 0.3, type: "spring", stiffness: 300 }
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      scaleY: 0.6,
      transition: {
        height: { duration: 0.2 },
        scaleY: { duration: 0.2 }
      }
    }
  };

  // Animation variants for the quote expansion
  const quoteVariants = {
    initial: { opacity: 0, height: 0 },
    animate: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-12">
        <motion.h1
          className="text-5xl font-bold text-center mb-8 text-yellow-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Poker Tournament Leaderboard
        </motion.h1>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Search by name, country or quote"
            className="w-full p-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </motion.div>

        <motion.div
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-4 text-left">Rank</th>
                  <th className="px-6 py-4 text-left cursor-pointer" onClick={() => requestSort('name')}>
                    Player Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-left cursor-pointer" onClick={() => requestSort('country')}>
                    Country {sortConfig.key === 'country' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-right cursor-pointer" onClick={() => requestSort('winnings')}>
                    Winnings {sortConfig.key === 'winnings' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-right cursor-pointer" onClick={() => requestSort('tournaments')}>
                    Tournaments {sortConfig.key === 'tournaments' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-center">Quote</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredPlayers.map((player, index) => (
                    <React.Fragment key={player.id}>
                      <motion.tr
                        variants={rowVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={'hover:bg-yellow-700 ' + (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700')}
                        onClick={() => toggleRowExpansion(player.id)}
                      >
                        <td className="px-6 py-4 font-bold">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {player.name}
                        </td>
                        <td className="px-6 py-4">
                          {player.country}
                        </td>
                        <td className="px-6 py-4 text-right text-yellow-400 font-bold">
                          {formatCurrency(player.winnings)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {player.tournaments}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className='px-3 py-1 rounded text-sm font-medium transition-colors duration-200 bg-gray-600 hover:bg-gray-700 text-gray-200'
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpansion(player.id);
                            }}
                          >
                            {expandedRow === player.id ? 'Hide Quote' : 'Show Quote'}
                          </button>
                        </td>
                      </motion.tr>
                      <AnimatePresence>
                        {expandedRow === player.id && (
                          <motion.tr
                            variants={quoteVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className={index % 2 === 0 ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-750 bg-opacity-50'}
                          >
                            <td className="px-6 py-4" colSpan={6}>
                              <div className="flex items-center">
                                <div className="w-8 h-8 flex-shrink-0 text-yellow-400 mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                  </svg>
                                </div>
                                <div className="italic text-yellow-300">"{player.quote}"</div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Click on column headers to sort the leaderboard or click on a row to see the player's quote</p>
        </motion.div>
      </main>
    </div>
  );
}