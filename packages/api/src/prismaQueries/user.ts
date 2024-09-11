import type { Prisma } from "@GeoScheduler/db";

export const prismaUserQuery = {};

export type PrismaUser = Prisma.UserGetPayload<typeof prismaUserQuery>;
