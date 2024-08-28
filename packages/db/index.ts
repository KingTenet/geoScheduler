import { $Enums, Prisma, PrismaClient } from "@prisma/client";

const db = new PrismaClient({
    log: ["query"],
});

export { Prisma, db, $Enums };
