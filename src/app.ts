import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { envVars } from "./app/config/env";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);

// Logging
if (envVars.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter);

// Session and Passport initialization based on Auth System
if (envVars.AUTH_SYSTEM === "passport") {
  app.use(
    expressSession({
      secret: envVars.EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: envVars.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
}

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Production Ready Backend Starter Template!",
    version: "1.0.0",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
