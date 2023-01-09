import express from 'express';
import cors from 'cors';
import { router } from './trpc';
import * as trpcExpress from '@trpc/server/adapters/express';

export const appRouter = router({});

const app = express();

app.use(cors());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

export type AppRouter = typeof appRouter;
const port = 3001;
app.listen(port, () => console.log(`Server started in ${port}`));
