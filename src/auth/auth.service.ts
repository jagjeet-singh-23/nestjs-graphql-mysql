import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { UserService } from 'src/users/user.service';
import { AuthResponse } from './dto/auth.response';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateToken(token: string) {
    return await this.jwtService.verifyAsync(token);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByUsername(username);
    if (!user) return null;

    const doesPasswordMatches = await bcrypt.compare(pass, user.password);

    if (!doesPasswordMatches) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }

  async login(user: any, res: Response): Promise<AuthResponse> {
    const payload = { username: user.username, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '600s',
    });

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return { access_token }; // return an AuthResponse instead of calling res.send()
  }

  logout(res: Response): boolean {
    res.cookie('access_token', null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 1000),
    });
    return true;
  }
}
