// Create a separate file for DELETE operation
import { NextRequest, NextResponse } from 'next/server';
import { 
  deletePlayer, 
} from '@/lib/players';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = parseInt(params.id, 10);
    
    if (isNaN(playerId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid player ID' },
        { status: 400 }
      );
    }
    
    const updatedPlayers = await deletePlayer(playerId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Player deleted successfully',
      players: updatedPlayers
    });
  } catch (error) {
    console.error(`Error in DELETE /api/players/${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete player' },
      { status: 500 }
    );
  }
}