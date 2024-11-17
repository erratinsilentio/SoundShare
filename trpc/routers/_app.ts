import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  getShortUrl: baseProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    return "siema = " + input;
  }),
  getLongUrl: baseProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
