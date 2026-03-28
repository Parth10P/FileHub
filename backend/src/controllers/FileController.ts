import { Request, Response, NextFunction } from "express";
import path from "path";
import { FileService } from "../services/FileService";
import { AppError } from "../utils/appError";

export class FileController {
  constructor(private readonly fileService: FileService) {}

  upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const file = await this.fileService.upload(req.file, userId);
      res.status(201).json(file);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const files = await this.fileService.getFiles(userId);
      res.status(200).json(files);
    } catch (error) {
      next(error);
    }
  };

  download = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const file = await this.fileService.download(req.params.fileId, userId);
      res.download(path.resolve(file.filePath), file.fileName);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      await this.fileService.delete(req.params.fileId, userId);
      res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
