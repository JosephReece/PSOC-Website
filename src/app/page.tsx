'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import {
  Trophy,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Users,
  Medal,
  TrendingDown,
  Calendar,
  Filter,
  MapPin,
  Wrench,
} from 'lucide-react';
import { Player } from '@/lib/players';
import Link from 'next/link';

export default function Home() {
  // State for players data
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Player;
    direction: 'descending' | 'ascending';
  }>({
    key: 'winnings',
    direction: 'descending'
  });

  // Filter state
  const [filterValue, setFilterValue] = useState('');
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');

  // Expanded row state
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Fetch players data from the API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/players');

        if (!response.ok) {
          throw new Error(`Failed to fetch players: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          setPlayers(data.players);
        } else {
          setError(data.error || 'Failed to fetch players');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Function to sort the players
  const sortedPlayers = [...players].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  // Function to filter players
  const filteredPlayers = sortedPlayers.filter(player => {
    // Text search filter
    const matchesText = filterValue === '' ||
      player.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      player.country.toLowerCase().includes(filterValue.toLowerCase()) ||
      player.quote.toLowerCase().includes(filterValue.toLowerCase());

    // Category filter
    if (activeFilterCategory === 'all') return matchesText;
    if (activeFilterCategory === 'winners') return matchesText && player.winnings > 0;
    if (activeFilterCategory === 'losers') return matchesText && player.winnings <= 0;
    if (activeFilterCategory === 'tournaments') return matchesText && player.tournaments > 0;
    if (activeFilterCategory === 'no-tournaments') return matchesText && player.tournaments === 0;

    return matchesText;
  });

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
    initial: {
      opacity: 0,
      height: 0,
      x: -20,
      scale: 0.95,
      rotateX: -10
    },
    animate: {
      opacity: 1,
      height: "auto",
      x: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.25,
          delay: 0.1
        }
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      x: 20,
      scale: 0.95,
      rotateX: 10,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  // State to track screen size
  const [isMobile, setIsMobile] = useState(false);

  // Effect to check screen size on load and resize
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is standard md breakpoint
    };

    // Check on initial load
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isMobile && <Trophy className="text-yellow-400 w-10 h-10 mr-3" />}
          <h1 className="text-5xl font-bold text-center text-yellow-400">
            Poker Tournament Leaderboard
          </h1>
        </motion.div>

        {error && (
          <motion.div
            className="mb-4 p-3 bg-red-900 text-red-100 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Error: {error}
            <button
              className="ml-2 text-red-200 hover:text-white"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : (
          <>
            <motion.div
              className="mb-4 relative flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, country or quote"
                className="flex-1 p-3 pl-10 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <Link
                href="/admin"
                className="w-fit-content px-4 py-2 bg-yellow-600 text-white rounded-lg flex items-center hover:bg-yellow-500 transition-colors"
              >
                <Wrench className="w-5 h-5 mr-3" />
                Edit Players
              </Link>
            </motion.div>

            {/* Mobile Filter Categories */}
            {isMobile && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter by:
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    label="All"
                    icon={<Users className="w-4 h-4 mr-1" />}
                    isActive={activeFilterCategory === 'all'}
                    onClick={() => setActiveFilterCategory('all')}
                  />
                  <FilterButton
                    label="Winners"
                    icon={<Trophy className="w-4 h-4 mr-1" />}
                    isActive={activeFilterCategory === 'winners'}
                    onClick={() => setActiveFilterCategory('winners')}
                  />
                  <FilterButton
                    label="Losers"
                    icon={<TrendingDown className="w-4 h-4 mr-1" />}
                    isActive={activeFilterCategory === 'losers'}
                    onClick={() => setActiveFilterCategory('losers')}
                  />
                  <FilterButton
                    label="Tournament Players"
                    icon={<Medal className="w-4 h-4 mr-1" />}
                    isActive={activeFilterCategory === 'tournaments'}
                    onClick={() => setActiveFilterCategory('tournaments')}
                  />
                  <FilterButton
                    label="No Tournaments"
                    icon={<Calendar className="w-4 h-4 mr-1" />}
                    isActive={activeFilterCategory === 'no-tournaments'}
                    onClick={() => setActiveFilterCategory('no-tournaments')}
                  />
                </div>

                {/* Mobile Sort Options */}
                <div className="mt-4">
                  <div className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <ArrowUpDown className="w-4 h-4 mr-1" />
                    Sort by:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SortButton
                      label="Name"
                      isActive={sortConfig.key === 'name'}
                      direction={sortConfig.direction}
                      onClick={() => requestSort('name')}
                    />
                    <SortButton
                      label="Winnings"
                      isActive={sortConfig.key === 'winnings'}
                      direction={sortConfig.direction}
                      onClick={() => requestSort('winnings')}
                    />
                    <SortButton
                      label="Tournaments"
                      isActive={sortConfig.key === 'tournaments'}
                      direction={sortConfig.direction}
                      onClick={() => requestSort('tournaments')}
                    />
                    <SortButton
                      label="Country"
                      isActive={sortConfig.key === 'country'}
                      direction={sortConfig.direction}
                      onClick={() => requestSort('country')}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {isMobile ? (
                // Mobile view - card-based layout
                <div className="grid gap-4 p-4">
                  {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player, index) => (
                      <motion.div
                        key={player.id}
                        className="bg-gray-700 rounded-lg p-4 shadow"
                        variants={rowVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Medal className={`w-5 h-5 mr-1 ${index < 3 ? 'text-yellow-400' : 'text-gray-400'}`} />
                            <span className="font-bold text-xl">{index + 1}</span>
                          </div>
                          <span className={`font-bold flex items-center ${player.winnings > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {player.winnings > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                            {formatCurrency(player.winnings)}
                          </span>
                        </div>

                        <div className="mb-2">
                          <h3 className="font-medium text-lg">{player.name}</h3>
                          <p className="text-gray-300 flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {player.country}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300 flex items-center">
                            <Trophy className="w-4 h-4 mr-1 text-gray-400" />
                            Tournaments: {player.tournaments}
                          </span>
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 rounded text-sm font-medium transition-colors duration-200 bg-gray-600 hover:bg-gray-700 text-gray-200 flex items-center"
                              onClick={() => toggleRowExpansion(player.id)}
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {expandedRow === player.id ? 'Hide Quote' : 'Show Quote'}
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedRow === player.id && (
                            <motion.div
                              variants={quoteVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              className="mt-2 pt-2 border-t border-gray-600"
                            >
                              <div className="flex items-start">
                                <MessageSquare className="w-5 h-5 flex-shrink-0 text-yellow-400 mr-2 mt-1" />
                                <div className="italic text-yellow-300">"{player.quote}"</div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No players match your filters. Try adjusting your search or filters.
                    </div>
                  )}
                </div>
              ) : (
                // Desktop view - table layout
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Header */}
                    <div className="grid grid-cols-6 bg-gray-700">
                      <div className="px-6 py-4 text-left font-semibold flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                        Rank
                      </div>
                      <div className="px-6 py-4 text-left cursor-pointer font-semibold flex items-center" onClick={() => requestSort('name')}>
                        <Users className="w-5 h-5 mr-2" />
                        Player Name
                        {sortConfig.key === 'name' && (
                          sortConfig.direction === 'ascending'
                            ? <ArrowUp className="w-4 h-4 ml-1" />
                            : <ArrowDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                      <div className="px-6 py-4 text-left cursor-pointer font-semibold flex items-center" onClick={() => requestSort('country')}>
                        <MapPin className="w-5 h-5 mr-2" />
                        Country
                        {sortConfig.key === 'country' && (
                          sortConfig.direction === 'ascending'
                            ? <ArrowUp className="w-4 h-4 ml-1" />
                            : <ArrowDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                      <div className="px-6 py-4 text-right cursor-pointer font-semibold flex items-center justify-end" onClick={() => requestSort('winnings')}>
                        Winnings
                        {sortConfig.key === 'winnings' && (
                          sortConfig.direction === 'ascending'
                            ? <ArrowUp className="w-4 h-4 ml-1" />
                            : <ArrowDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                      <div className="px-6 py-4 text-right cursor-pointer font-semibold flex items-center justify-end" onClick={() => requestSort('tournaments')}>
                        Tournaments
                        {sortConfig.key === 'tournaments' && (
                          sortConfig.direction === 'ascending'
                            ? <ArrowUp className="w-4 h-4 ml-1" />
                            : <ArrowDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                      <div className="px-6 py-4 text-center font-semibold flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Quote
                      </div>
                    </div>

                    {/* Rows */}
                    <AnimatePresence>
                      {filteredPlayers.length > 0 ? (
                        filteredPlayers.map((player, index) => (
                          <React.Fragment key={player.id}>
                            <motion.div
                              variants={rowVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className={'grid grid-cols-6 hover:bg-gray-750 ' + (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700')}
                            >
                              <div className="px-6 py-4 font-bold flex items-center">
                                <Medal className={`w-5 h-5 mr-2 ${index < 3 ? 'text-yellow-400' : 'text-gray-400'}`} />
                                {index + 1}
                              </div>
                              <div className="px-6 py-4 font-medium">
                                {player.name}
                              </div>
                              <div className="px-6 py-4 flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                {player.country}
                              </div>
                              <div className={`px-6 py-4 text-right font-bold flex items-center justify-end ${player.winnings > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {player.winnings > 0
                                  ? <ArrowUp className="w-4 h-4 mr-1" />
                                  : <ArrowDown className="w-4 h-4 mr-1" />
                                }
                                {formatCurrency(player.winnings)}
                              </div>
                              <div className="px-6 py-4 text-right flex items-center justify-end">
                                <Trophy className={`w-4 h-4 mr-2 ${player.tournaments > 0 ? 'text-yellow-400' : 'text-gray-400'}`} />
                                {player.tournaments}
                              </div>
                              <div className="px-6 py-4 text-center">
                                <button
                                  className='px-3 py-1 rounded text-sm font-medium transition-colors duration-200 bg-gray-600 hover:bg-gray-700 text-gray-200 flex items-center justify-center mx-auto'
                                  onClick={() => toggleRowExpansion(player.id)}
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  {expandedRow === player.id ? 'Hide Quote' : 'Show Quote'}
                                </button>
                              </div>
                            </motion.div>

                            <AnimatePresence>
                              {expandedRow === player.id && (
                                <motion.div
                                  variants={quoteVariants}
                                  initial="initial"
                                  animate="animate"
                                  exit="exit"
                                  className={index % 2 === 0 ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-750 bg-opacity-50'}
                                >
                                  <div className="px-6 py-4 col-span-6">
                                    <div className="flex items-center">
                                      <MessageSquare className="w-6 h-6 flex-shrink-0 text-yellow-400 mr-3" />
                                      <div className="italic text-yellow-300">"{player.quote}"</div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400 col-span-6">
                          No players match your filters. Try adjusting your search or filters.
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              className="mt-8 text-center text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="flex items-center justify-center">
                {isMobile
                  ? <>
                    <Filter className="w-4 h-4 mr-1" />
                    Use filters above to sort and categorize players
                  </>
                  : <>
                    <ArrowUpDown className="w-4 h-4 mr-1" />
                    Click on column headers to sort the leaderboard or click on a row to see the player's quote
                  </>
                }
              </p>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}

// Component for filter buttons with icons
const FilterButton = ({
  label,
  icon,
  isActive,
  onClick
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void
}) => (
  <button
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${isActive
      ? 'bg-yellow-600 text-white'
      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    onClick={onClick}
  >
    {icon}
    {label}
  </button>
);

// Component for sort buttons
const SortButton = ({
  label,
  isActive,
  direction,
  onClick
}: {
  label: string;
  isActive: boolean;
  direction: 'ascending' | 'descending';
  onClick: () => void
}) => (
  <button
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex justify-between items-center ${isActive
      ? 'bg-gray-600 text-white'
      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    onClick={onClick}
  >
    <span>{label}</span>
    {isActive && (
      direction === 'ascending'
        ? <ArrowUp className="w-4 h-4 ml-1" />
        : <ArrowDown className="w-4 h-4 ml-1" />
    )}
  </button>
);