import type { DayOfWeek } from "@prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";

const db = new PrismaClient({
    log: ["query"],
});

interface $Enums {
    DayOfTheWeek: DayOfWeek;
}

export { Prisma, PrismaClient, db };

export type { $Enums, DayOfWeek };
