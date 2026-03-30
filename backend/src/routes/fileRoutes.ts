import { Router } from "express";
import { FileController } from "../controllers/FileController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../utils/upload";

export const createFileRouter = (fileController: FileController): Router => {
  const router = Router();

  router.use(authMiddleware);
  router.post("/upload", upload.single("file"), fileController.upload);
  router.get("/", fileController.getAll);
  router.get("/download/:fileId", fileController.download);
  router.delete("/:fileId", fileController.delete);

  return router;
};
