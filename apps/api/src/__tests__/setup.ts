// =============================================================================
// __tests__/setup.ts — Global test lifecycle for MongoDB
//
// Runs before/after ALL tests in the suite (not just one file) because this
// file is listed in vitest.config.ts setupFiles.
// =============================================================================

import { beforeAll, afterAll, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

// Start the in-memory MongoDB once. Allow 60s for first-run binary download.
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}, 60_000);

// Wipe every collection after each test so tests stay fully isolated.
afterEach(async () => {
  const cols = mongoose.connection.collections;
  await Promise.all(Object.values(cols).map((c) => c.deleteMany({})));
});

// Disconnect and shut down the server once all tests are done.
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
