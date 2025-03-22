import { list, put } from '@vercel/blob';

const BLOB_PREFIX = 'poker-players';

export interface Player {
  id: number;
  name: string;
  winnings: number;
  tournaments: number;
  country: string;
  quote: string;
}

// Function to save player data to Vercel Blob
export async function savePlayersToBlobStorage(players: Player[]): Promise<void> {
  // Convert players array to JSON string
  const jsonData = JSON.stringify(players);

  // Save to Vercel Blob
  await put(`${BLOB_PREFIX}/players.json`, jsonData, {
    contentType: 'application/json',
    access: 'public',
  });
}

// Function to retrieve player data from Vercel Blob
export async function getPlayersFromBlobStorage(): Promise<Player[]> {
  try {
    // List files in our defined prefix
    const { blobs } = await list({ prefix: BLOB_PREFIX });

    // Find the players.json file
    const playerBlob = blobs.find(blob => blob.pathname.endsWith('players.json'));

    if (playerBlob) {
      // Fetch the file content
      const response = await fetch(playerBlob.url);

      if (!response.ok) {
        throw new Error(`Failed to fetch player data: ${response.statusText}`);
      }

      // Parse the JSON content
      const players: Player[] = await response.json();
      return players;
    }

    // Return empty array if no data found
    return [];
  } catch (error) {
    console.error('Error retrieving players from Blob storage:', error);
    return [];
  }
}

// Function to add a new player
export async function addPlayer(player: Omit<Player, 'id'>): Promise<Player[]> {
  const players = await getPlayersFromBlobStorage();

  // Generate a new ID (max existing ID + 1, or 1 if no players yet)
  const newId = players.length > 0
    ? Math.max(...players.map(p => p.id)) + 1
    : 1;

  const newPlayer: Player = {
    ...player,
    id: newId
  };

  const updatedPlayers = [...players, newPlayer];

  await savePlayersToBlobStorage(updatedPlayers);

  return updatedPlayers;
}

// Function to update an existing player
export async function updatePlayer(updatedPlayer: Player): Promise<Player[]> {
  const players = await getPlayersFromBlobStorage();

  const updatedPlayers = players.map(player =>
    player.id === updatedPlayer.id ? updatedPlayer : player
  );

  await savePlayersToBlobStorage(updatedPlayers);

  return updatedPlayers;
}

// Function to delete a player
export async function deletePlayer(playerId: number): Promise<Player[]> {
  const players = await getPlayersFromBlobStorage();

  const updatedPlayers = players.filter(player => player.id !== playerId);

  await savePlayersToBlobStorage(updatedPlayers);

  return updatedPlayers;
}