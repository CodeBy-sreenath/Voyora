import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
//import connectDB from '../../../../lib/mongodb';
//import User from '../../../../lib/models/User';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/lib/models/User';

export async function GET(req) {
  try {
    // Read token from cookie
    const token = req.cookies.get('voyara_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated.' },
        { status: 401 }
      );
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB()

    // Get fresh user from DB (excluding password)
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id:    user._id,
          name:  user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

  } catch (err) {
    // Token expired or invalid
    return NextResponse.json(
      { error: 'Invalid or expired session.' },
      { status: 401 }
    );
  }
}