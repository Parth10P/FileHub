import { IUser } from "../models/User";
import { CreateUserData, IUserRepository } from "./interfaces";
import { UserModel } from "../models/User";

export class UserRepository implements IUserRepository {
  async create(data: CreateUserData): Promise<IUser> {
    return UserModel.create(data);
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }
}
