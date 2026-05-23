import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const barcode = searchParams.get('barcode');

  try {
    if (barcode) {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (query) {
      // Use the standard search endpoint, server-side bypasses CORS
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(query)}&fields=code,product_name,brands,nutriments&page_size=20`, {
        headers: {
          'User-Agent': 'AForxa/1.0 - Web Application'
        }
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  } catch (error) {
    console.error('OpenFoodFacts API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from OpenFoodFacts' }, { status: 500 });
  }
}
