import type { Prisma } from "@GeoScheduler/db";

export const prismaActionQuery = {
    include: {
        geoScheduleConfig: {
            include: {
                appsToBlock: {
                    select: {
                        apps: true,
                    },
                },
            },
        },
    },
};

// export const prismaActionWhereUser = (userId: string) => ({
//     where: {
//         geoScheduleConfig: {
//             userId: userId,
//         },
//     },
// });

export type PrismaAction = Prisma.ActionsGetPayload<typeof prismaActionQuery>;
