import { User, IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

export interface RegisterDTO {
  email: string;
  password: string;
  role?: 'user' | 'manager';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

class AuthService {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      throw ApiError.badRequest('User with this email already exists');
    }

    const user = await User.create({
      email: data.email,
      password: data.password,
      role: data.role || 'user',
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await User.findOne({ email: data.email }).select('+password');

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(data.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  }
}

export const authService = new AuthService();
