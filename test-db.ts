// Simple CLI to test the MongoDB connection using the existing helper
// Usage: npm run test:db

import 'dotenv/config';

// Use relative path to avoid relying on Next.js path aliases when running via tsx
import { connectToDatabase } from './database/mongoose';

async function main() {
  const startedAt = new Date();
  try {
    const conn = await connectToDatabase();
    const { host, name, readyState } = conn.connection;
    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    console.log('OK');
    console.log(
      JSON.stringify(
        {
          startedAt: startedAt.toISOString(),
          nodeEnv: process.env.NODE_ENV,
          db: {
            host,
            name,
            readyState,
            state: stateMap[readyState as 0 | 1 | 2 | 3] ?? 'unknown',
            driver: 'mongoose',
            version: conn.version,
          },
        },
        null,
        2
      )
    );
    // Exit cleanly
    process.exit(0);
  } catch (err: any) {
    console.error('ERROR');
    console.error(
      JSON.stringify(
        {
          message: 'Database connection failed',
          error: {
            name: err?.name,
            message: err?.message,
          },
        },
        null,
        2
      )
    );
    process.exit(1);
  }
}

main();
