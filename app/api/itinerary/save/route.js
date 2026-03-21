import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import Itinerary from '../../../lib/models/Itinerary';

export async function POST(req) {
  try {
    const token = req.cookies.get('voyara_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'You must be logged in to save itineraries.' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: 'Invalid session. Please sign in again.' },
        { status: 401 }
      );
    }

    const { itinerary, inputs } = await req.json();

    if (!itinerary) {
      return NextResponse.json(
        { error: 'No itinerary data provided.' },
        { status: 400 }
      );
    }

    await connectDB();

    const saved = await Itinerary.create({
      userId:          decoded.userId,
      destination:     itinerary.destination,
      summary:         itinerary.summary,
      totalDays:       itinerary.totalDays,
      bestTimeToVisit: itinerary.bestTimeToVisit,
      weatherNote:     itinerary.weatherNote,
      budgetBreakdown: itinerary.budgetBreakdown,
      days:            itinerary.days,
      localTips:       itinerary.localTips,
      packingTips:     itinerary.packingTips,
      emergencyInfo:   itinerary.emergencyInfo,
      inputs:          inputs || {},
    });

    return NextResponse.json({
      success: true,
      message: 'Itinerary saved successfully!',
      id:      saved._id,
    });

  } catch (err) {
    console.error('Save itinerary error:', err);
    return NextResponse.json(
      { error: 'Could not save itinerary. Please try again.' },
      { status: 500 }
    );
  }
}