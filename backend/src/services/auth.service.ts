// src/services/auth.service.ts
import { User, IUserDocument } from '../models/User';
import { generateToken } from '../utils/jwt';
import { UserRole, JwtPayload } from '../types';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      const error = new Error('Email already in use') as Error & { statusCode: number };
      error.statusCode = 409;
      throw error;
    }

    const user: IUserDocument = await User.create({
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role || 'sales',
    });

    const payload: JwtPayload = {
      userId: String(user._id),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await User.findOne({ email: input.email }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password') as Error & { statusCode: number };
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password') as Error & { statusCode: number };
      error.statusCode = 401;
      throw error;
    }

    const payload: JwtPayload = {
      userId: String(user._id),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getUserById(userId: string): Promise<IUserDocument | null> {
    return User.findById(userId).select('-password');
  }
}

export const authService = new AuthService();
