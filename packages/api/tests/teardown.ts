import { db as prisma } from "@GeoScheduler/db";

export default async (): Promise<void> => {
    await prisma.$disconnect();
};
