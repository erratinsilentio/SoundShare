import { db } from "@vercel/postgres";
import { publicProcedure, router } from "./trpc";
const appRouter = router({
  getShortUrl: publicProcedure.query(async () => {}),
  getLongUrl: publicProcedure.query(async () => {}),
});

/* 
1. long url is sent to backend to store, and short url is returned
1. short utl is sent to backend to identify, and long url is returned
*/
