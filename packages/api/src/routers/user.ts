import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

// import type { Prisma } from "@GeoScheduler/db";
// import {
//     createGeoSchedulePayloadSchema,
//     createWithDailySchema,
//     createWithWeeklySchema,
// } from "@GeoScheduler/validators";

export const userRouter = createTRPCRouter({
    delete: publicProcedure.mutation(({ ctx }) => {
        return ctx.db.user.delete({ where: { id: ctx.user.id } });
    }),
});
