import type { DaemonAction } from "./generated/client";
import { Prisma, PrismaClient } from "./generated/client";

const globalForPrisma = globalThis as unknown as { db?: PrismaClient };

export const db =
    globalForPrisma.db ??
    new PrismaClient({
        log: ["query"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.db = db;
}

export type { DaemonAction };
export { Prisma, PrismaClient };
