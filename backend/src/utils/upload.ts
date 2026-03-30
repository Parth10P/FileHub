import fs from "fs";
import multer from "multer";
import path from "path";
import { env } from "../config/env";

fs.mkdirSync(env.uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, env.uploadsDir);
  },
  filename: (_req, file, callback) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    callback(null, uniqueName);
  }
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    if (!extension) {
      callback(new Error("Invalid file"));
      return;
    }

    callback(null, true);
  }
});
