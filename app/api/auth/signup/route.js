import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/lib/models/User';
//import connectDB from '../../../../lib/mongodb';
//import User from '../../../../lib/models/User';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // ── Validation ──────────────────────────────────────
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required.' },
        { status: 400 }
      );
    }
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters.' },
        { status: 400 }
      );
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // ── Connect to DB ────────────────────────────────────
    //await connectDB();
    await connectDB();

    // ── Check if email already exists ────────────────────
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // ── Hash password ────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── Create user ──────────────────────────────────────
    const user = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // ── Sign JWT ─────────────────────────────────────────
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ── Set cookie + return user ─────────────────────────
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully!',
        user: {
          id:    user._id,
          name:  user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );

    response.cookies.set('voyara_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     '/',
    });

    return response;

  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}