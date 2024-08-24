import { appsRouter } from "./routers/apps";
import { geoSchedulesRouter } from "./routers/geoSchedules";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";
import { postRouter as post2 } from "./routers/post2";
import { createCallerFactory, createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    post: postRouter,
    post2: post2,
    geoSchedules: geoSchedulesRouter,
    apps: appsRouter,
    user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
