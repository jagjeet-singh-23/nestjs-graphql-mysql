import { UserService } from './../users/UserService';
import { Injectable } from '@nestjs/common';
import { AuthInput } from './dto/auth.input';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(authInput: AuthInput) {
    const payload = { username: authInput.username, pass: authInput.password };

    const user = await this.userService.getUserByUsername(payload.username);
    if (!user) return null;

    const isPasswordValid = payload.pass === user.password;
    if (!isPasswordValid) return null;

    const { password, ...result } = user;
    return result;
  }
}
