import bcrypt from "bcryptjs";
import { IUserRepository } from "../repositories/interfaces";
import { AppError } from "../utils/appError";
import { generateToken } from "../utils/token";

interface SignupInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async signup(data: SignupInput): Promise<{ token: string }> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    return { token };
  }

  async login(data: LoginInput): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    return { token };
  }
}
