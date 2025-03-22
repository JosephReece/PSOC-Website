import { NextResponse } from 'next/server';

export async function DELETE({...params}) {
  try {
    console.log(params);

    return NextResponse.json({ 
      success: true, 
      message: 'Player deleted successfully'
    });
  } catch (error) {
    console.error(`Error in DELETE /api/players/${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete player' },
      { status: 500 }
    );
  }
}