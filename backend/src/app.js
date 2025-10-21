//here we config our express js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
export const app = express();

app.use(
  cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true,
  })
);
//handles json format req
app.use(express.json({ limit: "20kb" }));

app.use(cookieParser());

app.use(express.urlencoded({ limit: "20kb", extended: true }));

import globalErrorHandler from "./utils/globalErrorHandler.js";
import authRouter from "./routes/auth.route.js";
import vaultRouter from "./routes/vault.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vault", vaultRouter);

app.use(globalErrorHandler);
