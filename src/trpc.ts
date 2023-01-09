import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();
export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
