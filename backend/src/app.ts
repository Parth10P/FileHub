import cors from "cors";
import express from "express";
import path from "path";
import { env } from "./config/env";
import { AuthController } from "./controllers/AuthController";
import { FileController } from "./controllers/FileController";
import { errorHandler } from "./middlewares/errorHandler";
import { FileRepository } from "./repositories/FileRepository";
import { UserRepository } from "./repositories/UserRepository";
import { createAuthRouter } from "./routes/authRoutes";
import { createFileRouter } from "./routes/fileRoutes";
import { AuthService } from "./services/AuthService";
import { FileService } from "./services/FileService";

const userRepository = new UserRepository();
const fileRepository = new FileRepository();

const authService = new AuthService(userRepository);
const fileService = new FileService(fileRepository);

const authController = new AuthController(authService);
const fileController = new FileController(fileService);

export const app = express();

app.use(
  cors({
    origin: env.frontendOrigin
  })
);
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../../frontend/public")));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "FileHub API is running" });
});

app.use("/api/auth", createAuthRouter(authController));
app.use("/api/files", createFileRouter(fileController));

app.get("/", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/public/index.html"));
});

app.use(errorHandler);
