import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/database/mongoose';

export async function GET() {
  const startedAt = new Date().toISOString();
  try {
    const conn = await connectToDatabase();

    const { host, name, readyState } = conn.connection;
    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return NextResponse.json(
      {
        ok: true,
        message: 'Database connection successful',
        details: {
          startedAt,
          nodeEnv: process.env.NODE_ENV,
          db: {
            host,
            name,
            readyState,
            state: stateMap[readyState as 0 | 1 | 2 | 3] ?? 'unknown',
            driver: 'mongoose',
            version: mongoose.version,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Database connection failed',
        error: {
          name: error?.name,
          message: error?.message,
        },
      },
      { status: 500 }
    );
  }
}
