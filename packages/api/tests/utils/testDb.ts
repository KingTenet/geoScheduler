import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const setupTestDb = async () => {
    // Set up your test database here
    // For example, you might want to create some test data
};

export const teardownTestDb = async () => {
    // Clean up your test database here
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
    // Add more tables as needed
};

export { prisma };
