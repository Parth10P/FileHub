import { IUser } from "../models/User";
import { IFile } from "../models/File";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface CreateFileData {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  userId: string;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
}

export interface IFileRepository {
  create(data: CreateFileData): Promise<IFile>;
  findById(id: string): Promise<IFile | null>;
  findByUserId(userId: string): Promise<IFile[]>;
  deleteById(id: string): Promise<void>;
}
