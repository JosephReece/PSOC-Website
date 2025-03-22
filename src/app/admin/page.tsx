// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy,
  UserPlus,
  User,
  Users,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  Lock,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Coins,
  MapPin,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Player } from '@/lib/players';

interface AdminPageProps {}

export default function AdminPage({}: AdminPageProps) {
  const router = useRouter();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Players state
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Toast notification
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  
  // Form states
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(10);
  
  // Simple authentication check (for demo purposes - in production, use proper auth)
  // In a real application, this would be handled by a secure authentication system
  const handleAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper auth
    if (password === 'admin123') { // Demo password - in real app use secure auth
      setIsAuthenticated(true);
      localStorage.setItem('pokerAdminAuth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid password');
    }
  };
  
  // Check if user is already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('pokerAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pokerAdminAuth');
    router.push('/admin');
  };
  
  // Fetch players data
  useEffect(() => {
    const fetchPlayers = async () => {
      if (!isAuthenticated) return;
      
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
    
    if (isAuthenticated) {
      fetchPlayers();
    }
  }, [isAuthenticated]);
  
  // Function to add a new player
  const handleAddPlayer = async (playerData: Omit<Player, 'id'>) => {
    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPlayers(data.players);
        setShowPlayerForm(false);
        showNotification('Player added successfully', 'success');
        // Reset form
        setCurrentPlayer(null);
      } else {
        setError(data.error || 'Failed to add player');
        showNotification('Failed to add player', 'error');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    }
  };
  
  // Function to update a player
  const handleUpdatePlayer = async (playerData: Player) => {
    try {
      const response = await fetch('/api/players', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPlayers(data.players);
        setShowPlayerForm(false);
        showNotification('Player updated successfully', 'success');
        // Reset form
        setCurrentPlayer(null);
      } else {
        setError(data.error || 'Failed to update player');
        showNotification('Failed to update player', 'error');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    }
  };
  
  // Function to delete a player
  const handleDeletePlayer = async (playerId: number) => {
    if (!window.confirm('Are you sure you want to delete this player?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/players/${playerId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPlayers(data.players);
        showNotification('Player deleted successfully', 'success');
      } else {
        setError(data.error || 'Failed to delete player');
        showNotification('Failed to delete player', 'error');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    }
  };
  
  // Helper function to show notifications
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Handle edit player click
  const handleEditPlayer = (player: Player) => {
    setCurrentPlayer(player);
    setFormMode('edit');
    setShowPlayerForm(true);
  };
  
  // Handle add player click
  const handleOpenAddForm = () => {
    setCurrentPlayer(null);
    setFormMode('add');
    setShowPlayerForm(true);
  };
  
  // Pagination logic
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  // Player form component
  const PlayerForm = () => {
    const [formData, setFormData] = useState<Omit<Player, 'id'> & { id?: number }>({
      name: currentPlayer?.name || '',
      winnings: currentPlayer?.winnings || 0,
      tournaments: currentPlayer?.tournaments || 0,
      country: currentPlayer?.country || 'UK',
      quote: currentPlayer?.quote || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: name === 'winnings' || name === 'tournaments' 
          ? parseInt(value, 10) || 0 
          : value
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formMode === 'add') {
        handleAddPlayer(formData);
      } else {
        handleUpdatePlayer({ ...formData, id: currentPlayer!.id });
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
        onClick={() => setShowPlayerForm(false)}
      >
        <motion.div 
          className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
          onClick={e => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 flex items-center">
              {formMode === 'add' ? (
                <>
                  <UserPlus className="w-6 h-6 mr-2" />
                  Add New Player
                </>
              ) : (
                <>
                  <Edit className="w-6 h-6 mr-2" />
                  Edit Player
                </>
              )}
            </h2>
            <button 
              onClick={() => setShowPlayerForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 flex items-center">
                <Coins className="w-4 h-4 mr-2" />
                Winnings
              </label>
              <input
                type="number"
                name="winnings"
                value={formData.winnings}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 flex items-center">
                <Trophy className="w-4 h-4 mr-2" />
                Tournaments
              </label>
              <input
                type="number"
                name="tournaments"
                value={formData.tournaments}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Quote
              </label>
              <textarea
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:border-yellow-400 focus:outline-none"
                rows={3}
                required
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPlayerForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 flex items-center"
              >
                <Save className="w-4 h-4 mr-1" />
                {formMode === 'add' ? 'Add Player' : 'Update Player'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };
  
  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          className="bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center mb-6">
            <Lock className="w-12 h-12 text-yellow-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-center text-white mb-6">
            Poker Tournament Admin
          </h1>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-100 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-300" />
              {authError}
            </div>
          )}
          
          <form onSubmit={handleAuthentication}>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white focus:border-yellow-400 focus:outline-none"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition font-medium flex items-center justify-center"
            >
              <Lock className="w-5 h-5 mr-2" />
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-gray-400 hover:text-yellow-400 text-sm"
            >
              Return to Leaderboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Trophy className="text-yellow-400 w-8 h-8 mr-3" />
            <h1 className="text-2xl font-bold text-yellow-400">
              Poker Tournament Admin
            </h1>
          </div>
          
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Leaderboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition flex items-center"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center ${
                notification.type === 'success' ? 'bg-green-700' : 'bg-red-700'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
              ) : (
                <AlertTriangle className="w-5 h-5 mr-2 text-red-300" />
              )}
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Manage Players
          </h2>
          
          <button
            onClick={handleOpenAddForm}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition flex items-center"
          >
            <UserPlus className="w-5 h-5 mr-1" />
            Add New Player
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-700 text-red-100 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-300" />
            {error}
            <button 
              className="ml-auto text-red-200 hover:text-white"
              onClick={() => setError(null)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : (
          <>
            {players.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  No players found
                </div>
                <button
                  onClick={handleOpenAddForm}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition flex items-center mx-auto"
                >
                  <UserPlus className="w-5 h-5 mr-1" />
                  Add Your First Player
                </button>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Country
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Winnings
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Tournaments
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800">
                      {currentPlayers.map((player) => (
                        <motion.tr 
                          key={player.id}
                          variants={itemVariants}
                          className="hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {player.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {player.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {player.country}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                            player.winnings > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 0
                            }).format(player.winnings)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {player.tournaments}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditPlayer(player)}
                              className="text-yellow-400 hover:text-yellow-300 mr-3"
                              title="Edit Player"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeletePlayer(player.id)}
                              className="text-red-400 hover:text-red-300"
                              title="Delete Player"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {players.length > playersPerPage && (
                  <div className="px-6 py-4 bg-gray-700 flex justify-between items-center">
                    <div className="text-sm text-gray-300">
                      Showing {indexOfFirstPlayer + 1} to {
                        indexOfLastPlayer > players.length ? players.length : indexOfLastPlayer
                      } of {players.length} players
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.ceil(players.length / playersPerPage) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`px-3 py-1 text-sm rounded ${
                            currentPage === index + 1
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </main>
      
      {/* Player Form Modal */}
      <AnimatePresence>
        {showPlayerForm && <PlayerForm />}
      </AnimatePresence>
    </div>
  );
}