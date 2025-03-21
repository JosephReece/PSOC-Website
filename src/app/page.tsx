'use client';

// pages/index.js
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

interface Player {
  id: number;
  name: string;
  winnings: number;
  tournaments: number;
  country: string;
}

export default function Home() {
  // Sample data for the leaderboard
  const players: Player[] = [
    { id: 1, name: "Daniel Negreanu", winnings: 42000000, tournaments: 87, country: "Canada" },
    { id: 2, name: "Phil Ivey", winnings: 38500000, tournaments: 72, country: "USA" },
    { id: 3, name: "Bryn Kenney", winnings: 57000000, tournaments: 65, country: "USA" },
    { id: 4, name: "Justin Bonomo", winnings: 53000000, tournaments: 61, country: "USA" },
    { id: 5, name: "Erik Seidel", winnings: 41000000, tournaments: 92, country: "USA" },
    { id: 6, name: "Fedor Holz", winnings: 36500000, tournaments: 51, country: "Germany" },
    { id: 7, name: "Phil Hellmuth", winnings: 29000000, tournaments: 110, country: "USA" },
    { id: 8, name: "Jason Koon", winnings: 39500000, tournaments: 58, country: "USA" },
    { id: 9, name: "David Peters", winnings: 44000000, tournaments: 67, country: "USA" },
    { id: 10, name: "Stephen Chidwick", winnings: 37800000, tournaments: 63, country: "UK" },
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
    player.country.toLowerCase().includes(filterValue.toLowerCase())
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Poker Tournament Leaderboard</title>
        <meta name="description" content="Top poker tournament winners" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
            placeholder="Search by name or country"
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
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredPlayers.map((player, index) => (
                    <motion.tr
                      key={player.id}
                      variants={rowVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                      whileHover={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}
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
                    </motion.tr>
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
          <p>Click on column headers to sort the leaderboard</p>
        </motion.div>
      </main>
    </div>
  );
}