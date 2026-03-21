import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const FREE_MODELS = [
  'openrouter/free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'google/gemini-2.0-flash-exp:free',
  'qwen/qwen3-8b:free',
];

export async function POST(req) {
  try {
    const {
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      style,
      preferences,
      days,
    } = await req.json();

    // ── Validate inputs ────────────────────────────────
    if (!destination || !startDate || !endDate || !budget) {
      return NextResponse.json(
        { error: 'Destination, dates and budget are required.' },
        { status: 400 }
      );
    }
    if (!days || days < 1) {
      return NextResponse.json(
        { error: 'End date must be after start date.' },
        { status: 400 }
      );
    }
    if (days > 30) {
      return NextResponse.json(
        { error: 'Maximum trip length is 30 days.' },
        { status: 400 }
      );
    }

    // ── Check login via JWT cookie ─────────────────────
    const token = req.cookies.get('voyara_token')?.value;
    let canSave = false;
    let userId  = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        canSave = true;
        userId  = decoded.userId;
      } catch {
        canSave = false;
      }
    }

    // ── Build prompt ───────────────────────────────────
    const prompt = `You are an expert travel planner with deep knowledge of destinations worldwide.
Create a detailed, realistic and exciting travel itinerary based on these details:

- Destination: ${destination}
- Travel dates: ${startDate} to ${endDate} (${days} days)
- Total budget: $${budget} USD for ${travelers} traveller(s)
- Travel style: ${style}
- Special preferences: ${preferences || 'None'}

Respond ONLY with a valid JSON object. No markdown, no extra text, no code fences.
Use exactly this structure:

{
  "destination": "City, Country",
  "summary": "2-3 engaging sentences about this trip",
  "totalDays": ${days},
  "bestTimeToVisit": "brief seasonal note",
  "weatherNote": "what weather to expect during travel dates",
  "budgetBreakdown": {
    "accommodation": "$X total",
    "food": "$X total",
    "activities": "$X total",
    "transport": "$X total"
  },
  "days": [
    {
      "day": 1,
      "date": "Mon, Jan 1",
      "theme": "Arrival & First Impressions",
      "morning": {
        "activity": "detailed activity description",
        "location": "exact place name",
        "duration": "2 hours",
        "cost": "$X per person",
        "tip": "insider tip"
      },
      "afternoon": {
        "activity": "detailed activity description",
        "location": "exact place name",
        "duration": "3 hours",
        "cost": "$X per person",
        "tip": "insider tip"
      },
      "evening": {
        "activity": "detailed activity description",
        "location": "exact place name",
        "duration": "2 hours",
        "cost": "$X per person",
        "tip": "insider tip"
      },
      "lunch": {
        "restaurant": "restaurant name",
        "dish": "must-try dish",
        "cuisine": "cuisine type",
        "priceRange": "$",
        "address": "area or street"
      },
      "dinner": {
        "restaurant": "restaurant name",
        "dish": "must-try dish",
        "cuisine": "cuisine type",
        "priceRange": "$$",
        "address": "area or street"
      },
      "stay": {
        "name": "hotel/hostel name",
        "type": "Hotel/Hostel/Airbnb/Resort",
        "area": "neighbourhood name",
        "pricePerNight": "$XX",
        "rating": "4.5/5"
      },
      "estimatedDayCost": "$XX per person",
      "highlights": ["highlight 1", "highlight 2"]
    }
  ],
  "packingTips": ["tip1", "tip2", "tip3"],
  "localTips": ["tip1", "tip2", "tip3", "tip4"],
  "emergencyInfo": {
    "emergency": "112 or local number",
    "hospital": "nearest major hospital",
    "embassy": "embassy contact if relevant"
  }
}

Generate all ${days} days. Make it detailed, realistic and genuinely helpful.`;

    // ── Try each free model until one works ────────────
    let openRouterData = null;
    let lastError      = null;

    for (const model of FREE_MODELS) {
      try {
        console.log(`Trying model: ${model}`);

        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer':  'http://localhost:3000',
            'X-Title':       'Voyara Travel Planner',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role:    'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens:  8000,
          }),
        });

        const data = await openRouterRes.json();

        // Skip if rate limited or any error
        if (
          !openRouterRes.ok     ||
          data?.error           ||
          data?.error?.code === 429
        ) {
          console.log(`Model ${model} failed:`, data?.error?.message);
          lastError = data?.error?.message;
          continue;
        }

        // Skip if empty content
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (!text) {
          console.log(`Model ${model} returned empty response`);
          continue;
        }

        openRouterData = data;
        console.log(`✓ Success with model: ${model}`);
        break;

      } catch (err) {
        console.log(`Model ${model} threw error:`, err.message);
        lastError = err.message;
        continue;
      }
    }

    // ── All models failed ──────────────────────────────
    if (!openRouterData) {
      console.error('All models failed. Last error:', lastError);
      return NextResponse.json(
        { error: 'All AI models are currently busy. Please try again in a minute.' },
        { status: 502 }
      );
    }

    // ── Extract text from response ─────────────────────
    const rawText = openRouterData?.choices?.[0]?.message?.content?.trim();

    if (!rawText) {
      return NextResponse.json(
        { error: 'Empty response from AI. Please try again.' },
        { status: 500 }
      );
    }

    // ── Strip markdown fences if any ───────────────────
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i,     '')
      .replace(/```$/i,        '')
      .trim();

    // ── Parse JSON ─────────────────────────────────────
    let itinerary;
    try {
      itinerary = JSON.parse(cleaned);
    } catch {
      console.error('JSON parse failed:', cleaned.slice(0, 300));
      return NextResponse.json(
        { error: 'Could not parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // ── Return result ──────────────────────────────────
    return NextResponse.json({
      success: true,
      itinerary,
      canSave,
      userId,
    });

  } catch (err) {
    console.error('Generate itinerary error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}