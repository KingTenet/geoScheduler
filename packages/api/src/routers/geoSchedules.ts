import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

// model BlockScheduleConfig {
//     id                 String                 @id @default(uuid())
//     externalBlocks     ExternalBlock[]
//     geometryCriteria   GeometryCriterium[]
//     fromTime           DateTime?
//     toTime             DateTime?
//     updateDelayType    UpdateDelayType?
//     updateDelaySeconds Int?
//     createdDate        DateTime               @default(now())
//     updatedDate        DateTime               @updatedAt
//     deleteStartedDate  DateTime?
//     deletionStatus     ScheduleDeletedStatus?
//     user               User                   @relation(fields: [userId], references: [id])
//     userId             String
//     dailyRecurrence    DailyRecurrence?
//     weeklyRecurrence   WeeklyRecurrence?
//     Actions            Actions[]
// }

const CreatePostSchema = z.object({
    content: z.string().max(256),
    title: z.string().max(256),
});

export const geoSchedulesRouter = createTRPCRouter({
    all: publicProcedure.query(({ ctx }) => {
        // const blah = ctx.db.query.Post.findMany({
        //     orderBy: desc(Post.id),
        //     limit: 10,
        // });

        return ctx.db.post2.findMany();
    }),

    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    getLatest: publicProcedure.query(async ({ ctx }) => {
        const post = await ctx.db.post2.findFirst({
            orderBy: { createdAt: "desc" },
        });

        return post ?? null;
    }),

    byId: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ ctx, input }) => {
            return ctx.db.post2.findFirst({
                where: { id: input.id },
            });

            // return ctx.db.query.Post.findFirst({
            //     where: eq(Post.id, input.id),
            // });
        }),

    create: publicProcedure
        .input(CreatePostSchema)
        .mutation(({ ctx, input }) => {
            return ctx.db.post2.create({ data: input });
        }),

    delete: publicProcedure.input(z.number()).mutation(({ ctx, input }) => {
        return ctx.db.post2.delete({ where: { id: input } });
    }),
});
