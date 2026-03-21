import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
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

IMPORTANT: Respond ONLY with a valid JSON object. 
No markdown, no extra text, no code fences, no explanation.
Start your response with { and end with }

Use exactly this JSON structure:

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

    // ── Try each Groq model until one works ────────────
    let groqData  = null;
    let lastError = null;

    for (const model of GROQ_MODELS) {
      try {
        console.log(`Trying Groq model: ${model}`);

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role:    'system',
                content: 'You are an expert travel planner. Always respond with valid JSON only. Never include markdown, code fences, or any text outside the JSON object.',
              },
              {
                role:    'user',
                content: prompt,
              },
            ],
            temperature:       0.7,
            max_tokens:        8000,
            response_format:   { type: 'json_object' },
          }),
        });

        const data = await groqRes.json();

        // Skip if error or rate limited
        if (!groqRes.ok || data?.error) {
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

        groqData = data;
        console.log(`✓ Success with Groq model: ${model}`);
        break;

      } catch (err) {
        console.log(`Model ${model} threw error:`, err.message);
        lastError = err.message;
        continue;
      }
    }

    // ── All models failed ──────────────────────────────
    if (!groqData) {
      console.error('All Groq models failed. Last error:', lastError);
      return NextResponse.json(
        { error: 'AI service unavailable. Please try again in a moment.' },
        { status: 502 }
      );
    }

    // ── Extract text from Groq response ───────────────
    const rawText = groqData?.choices?.[0]?.message?.content?.trim();

    if (!rawText) {
      return NextResponse.json(
        { error: 'Empty response from AI. Please try again.' },
        { status: 500 }
      );
    }

    // ── Strip markdown fences just in case ─────────────
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