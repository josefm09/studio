import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { origin, destination, date } = await req.json();
  const apiKey = process.env.GOOGLEAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Google Gemini API key.' }, { status: 500 });
  }

  // Gemini 2.0 Flash API endpoint (update if needed)
  const geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  // Build prompt
  const prompt = `Eres un agente de viajes especializado en encontrar los mejores vuelos diurnos para tus clientes.\n\nDado el origen, el destino y la fecha, resume los vuelos diurnos disponibles, ordenados por precio.\nExcluye cualquier vuelo que salga o llegue de noche (22:00 - 6:00 hora local).\n\nOrigen: ${origin}\nDestino: ${destination}\nFecha: ${date}`;

  // Gemini request body
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    const response = await fetch(`${geminiEndpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Error from Gemini API.' }, { status: 500 });
    }
    // Parse Gemini response
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: 'Hubo un problema al buscar los vuelos. Por favor, inténtalo de nuevo más tarde.' }, { status: 500 });
  }
}
