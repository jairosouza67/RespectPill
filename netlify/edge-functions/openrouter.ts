const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
const SITE_URL = Deno.env.get('SITE_URL') || 'https://360man.netlify.app';
const SITE_NAME = '360Man';
const AI_MODEL = "google/gemini-2.0-flash-lite-preview-02-05:free";

export default async (request: Request) => {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Check if API key is available
  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenRouter API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { systemPrompt, userPrompt } = await request.json();

    if (!systemPrompt || !userPrompt) {
      return new Response(JSON.stringify({ error: 'Missing systemPrompt or userPrompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": AI_MODEL,
        "messages": [
          { "role": "system", "content": systemPrompt },
          { "role": "user", "content": userPrompt }
        ],
        "temperature": 0.7,
        "max_tokens": 2000
      })
    });

    if (!response.ok) {
      console.error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ error: `OpenRouter API error: ${response.statusText}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: 'No content received from OpenRouter' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    });

  } catch (error) {
    console.error('Error in OpenRouter function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};