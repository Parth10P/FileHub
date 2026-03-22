import { Schema, model, Document, Types } from "mongoose";

export interface IFile extends Document {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadDate: Date;
  userId: Types.ObjectId;
}

const fileSchema = new Schema<IFile>({
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

export const FileModel = model<IFile>("File", fileSchema);
