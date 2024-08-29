import { actionsRouter } from "./routers/actions";
import { appsRouter } from "./routers/apps";
import { geoSchedulesRouter } from "./routers/geoSchedules";
import { placesRouter } from "./routers/places";
import { userRouter } from "./routers/user";
import { createCallerFactory, createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    geoSchedules: geoSchedulesRouter,
    apps: appsRouter,
    user: userRouter,
    actions: actionsRouter,
    places: placesRouter,
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
