import path from "path";
import dotenv from "dotenv";

dotenv.config();

const rootDir = path.resolve(__dirname, "../../");

export const env = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/filehub",
  jwtSecret: process.env.JWT_SECRET ?? "filehub-secret",
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  uploadsDir: path.join(rootDir, "uploads")
};
