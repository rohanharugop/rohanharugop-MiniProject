// app/api/save-college/route.ts
import { NextRequest, NextResponse } from 'next/server';

const FLASK_SERVER_URL = process.env.FLASK_SERVER_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const collegeData = await request.json();
    
    // Forward request to Flask server
    const flaskResponse = await fetch(`${FLASK_SERVER_URL}/save-college`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collegeData),
    });

    if (!flaskResponse.ok) {
      throw new Error(`Flask server responded with status: ${flaskResponse.status}`);
    }

    const data = await flaskResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error saving college data:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Flask server is not running',
          message: 'Please make sure the Python Flask server is running on port 5000'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}