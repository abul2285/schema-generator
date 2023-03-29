import { schemaRouter } from "./routers/schema";
import { createTRPCRouter } from "~/server/api/trpc";
import { templateRouter } from "./routers/template";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  scheme: schemaRouter,
  template: templateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
