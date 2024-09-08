import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (): Promise<void> => {
  await prisma.$disconnect();
};