import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import { userRouter } from "@/routers";
import { loadEnv } from './config/envs';
import { connectDb, disconnectDB } from './config/database';
import { handleApplicationErrors } from './middlewares/error-handling-middleware';

loadEnv();

const app = express();
app
  .use(cors())
  .use(express.json())
  .use("/users", userRouter)
  .use(handleApplicationErrors)
  
export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;