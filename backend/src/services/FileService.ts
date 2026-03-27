import fs from "fs/promises";
import path from "path";
import { IFile } from "../models/File";
import { IFileRepository } from "../repositories/interfaces";
import { AppError } from "../utils/appError";

export class FileService {
  private readonly maxFileSizeInBytes = 5 * 1024 * 1024;

  constructor(private readonly fileRepository: IFileRepository) {}

  async upload(file: Express.Multer.File | undefined, userId: string): Promise<IFile> {
    if (!file) {
      throw new AppError("Please choose a file to upload", 400);
    }

    if (file.size > this.maxFileSizeInBytes) {
      await fs.unlink(file.path).catch(() => undefined);
      throw new AppError("File must be 5MB or smaller", 400);
    }

    return this.fileRepository.create({
      fileName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      userId
    });
  }

  async getFiles(userId: string): Promise<IFile[]> {
    return this.fileRepository.findByUserId(userId);
  }

  async download(fileId: string, userId: string): Promise<IFile> {
    const file = await this.findOwnedFile(fileId, userId);
    return file;
  }

  async delete(fileId: string, userId: string): Promise<void> {
    const file = await this.findOwnedFile(fileId, userId);
    await fs.unlink(path.resolve(file.filePath)).catch(() => undefined);
    await this.fileRepository.deleteById(file.id);
  }

  private async findOwnedFile(fileId: string, userId: string): Promise<IFile> {
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new AppError("File not found", 404);
    }

    if (file.userId.toString() !== userId) {
      throw new AppError("You are not allowed to access this file", 403);
    }

    return file;
  }
}
