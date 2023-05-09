import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import { credentialRouter, networkRouter, userRouter } from "@/routers";
import { loadEnv } from './config/envs';
import { connectDb, disconnectDB } from './config/database';
import { handleApplicationErrors } from './middlewares/error-handling-middleware';
import { authenticationRouter } from './routers/authentication-router';

loadEnv();

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("OK!"))
  .use("/users", userRouter)
  .use("/auth", authenticationRouter)
  .use("/credentials", credentialRouter)
  .use("/network", networkRouter)
  .use(handleApplicationErrors)
  
export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;