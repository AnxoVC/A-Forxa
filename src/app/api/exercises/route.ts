import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');
  const name = searchParams.get('name');
  const limit = searchParams.get('limit') || '20';
  
  const apiKey = process.env.RAPIDAPI_KEY;
  
  if (!apiKey || apiKey === 'your_rapid_api_key_here') {
    return NextResponse.json({ error: 'Falta la API Key de RapidAPI en .env.local' }, { status: 401 });
  }

  try {
    let url = `https://exercisedb.p.rapidapi.com/exercises?limit=${limit}`;
    
    if (name) {
      url = `https://exercisedb.p.rapidapi.com/exercises/name/${name}?limit=${limit}`;
    } else if (target) {
      url = `https://exercisedb.p.rapidapi.com/exercises/target/${target}?limit=${limit}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      },
      // Cache exercises for 24 hours to save API quota
      next: { revalidate: 86400 } 
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`RapidAPI Error: ${errorData}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json({ error: 'Error al obtener los ejercicios de ExerciseDB.' }, { status: 500 });
  }
}
