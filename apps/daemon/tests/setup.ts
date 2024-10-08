import { db } from '@GeoScheduler/daemonDB';

beforeAll(async () => {
  // Setup test database or any other necessary setup
  await db.$connect();
});

afterAll(async () => {
  await db.$disconnect();
});
