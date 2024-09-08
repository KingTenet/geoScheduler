import { PrismaClient } from "@prisma/client";

// import { mockDeep } from 'jest-mock-extended';

const prisma = new PrismaClient();

beforeAll(async () => {
    // Set up test database
    await prisma.$connect();
});

afterAll(async () => {
    // Disconnect from test database
    await prisma.$disconnect();
});

// jest.mock('@GeoScheduler/db', () => ({
//   db: mockDeep<PrismaClient>(),
// }));
