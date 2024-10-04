import { authedProcedure, createTRPCRouter } from "../trpc";

export const userRouter = createTRPCRouter({
    me: authedProcedure.mutation(({ ctx }) => {
        return ctx.db.user.findFirst({
            where: { id: ctx.user.id },
        });
    }),
    delete: authedProcedure.mutation(({ ctx }) => {
        return ctx.db.user.delete({ where: { id: ctx.user.id } });
    }),
    login: authedProcedure.mutation(async ({ ctx }) => {
        await ctx.db.user.upsert({
            where: {
                id: ctx.user.id,
            },
            update: {},
            create: {
                id: ctx.user.id,
            },
        });
    }),
});
