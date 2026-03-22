import { IFile } from "../models/File";
import { CreateFileData, IFileRepository } from "./interfaces";
import { FileModel } from "../models/File";

export class FileRepository implements IFileRepository {
  async create(data: CreateFileData): Promise<IFile> {
    return FileModel.create(data);
  }

  async findById(id: string): Promise<IFile | null> {
    return FileModel.findById(id);
  }

  async findByUserId(userId: string): Promise<IFile[]> {
    return FileModel.find({ userId }).sort({ uploadDate: -1 });
  }

  async deleteById(id: string): Promise<void> {
    await FileModel.findByIdAndDelete(id);
  }
}
