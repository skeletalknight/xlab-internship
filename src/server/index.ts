import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import cors from 'cors';
import * as inter from '../interface';
import {db} from './db';

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;

function responseCreater(data:any):inter.Response{
  return {
    messages: "",
    code: 0,
    data: data,
  }
}

const t1 = initTRPC.context<Context>().create();
const roomRouter = t1.router({
  hello: t1.procedure
  .query(async () => {
    return "Hello 1";
  }),
  roomList: t1.procedure
  .query(async () => {
    const roomList = await db.room.getRoomList();
    return responseCreater(roomList);
  }),
});

const t2 = initTRPC.context<Context>().create();
const messageRouter = t2.router({
  hello: t2.procedure
  .query(async () => {
    return "Hello 2";
  })
});

const t3 = initTRPC.context<Context>().create();
const roomMessageRouter = t3.router({
  hello: t3.procedure
  .query(async () => {
    return "Hello 3";
  })
});

const app = express();

app.use(cors());

app.use(
  '/api/room',
  trpcExpress.createExpressMiddleware({
    router: roomRouter,
    createContext,
  }),
);

app.use(
  '/api/message',
  trpcExpress.createExpressMiddleware({
    router: messageRouter,
    createContext,
  }),
);

app.use(
  '/api/room/message',
  trpcExpress.createExpressMiddleware({
    router: roomMessageRouter,
    createContext,
  }),
);

app.listen(3000);

export type RoomRouter = typeof roomRouter;
export type MessageRouter = typeof messageRouter;
export type RoomMessageRouter = typeof roomMessageRouter;