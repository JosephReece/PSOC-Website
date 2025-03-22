// /app/api/players/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  getPlayersFromBlobStorage, 
  addPlayer, 
  updatePlayer, 
  Player
} from '@/lib/players';

// GET endpoint to retrieve all players
export async function GET() {
  try {
    // Try to get existing players, otherwise initialize with defaults
    const players = await getPlayersFromBlobStorage();
    
    return NextResponse.json({ success: true, players });
  } catch (error) {
    console.error('Error in GET /api/players:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve players' },
      { status: 500 }
    );
  }
}

// POST endpoint to add a new player
export async function POST(request: NextRequest) {
  try {
    const playerData = await request.json();
    
    // Basic validation
    const requiredFields = ['name', 'winnings', 'tournaments', 'country', 'quote'];
    for (const field of requiredFields) {
      if (!(field in playerData)) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    const updatedPlayers = await addPlayer(playerData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Player added successfully',
      players: updatedPlayers
    });
  } catch (error) {
    console.error('Error in POST /api/players:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add player' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a player
export async function PUT(request: NextRequest) {
  try {
    const playerData: Player = await request.json();
    
    // Validate player ID
    if (!playerData.id) {
      return NextResponse.json(
        { success: false, error: 'Player ID is required' },
        { status: 400 }
      );
    }
    
    const updatedPlayers = await updatePlayer(playerData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Player updated successfully',
      players: updatedPlayers
    });
  } catch (error) {
    console.error('Error in PUT /api/players:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update player' },
      { status: 500 }
    );
  }
}