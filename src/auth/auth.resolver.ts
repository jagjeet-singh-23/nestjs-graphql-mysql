import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth.input';
import { AuthResponse } from './dto/auth.response';
import { SkipAuthGuard } from './skipauth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  @SkipAuthGuard()
  async login(
    @Args('authInput') authInput: AuthInput,
    @Context() context: any, // get entire GraphQL context
  ) {
    const { username, password } = authInput;
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new Error('Invalid credentials');
    const { res } = context; // extract Express req and res
    return this.authService.login(user, res);
  }

  @Mutation(() => Boolean)
  logout(@Context() context: any) {
    const { res } = context;
    return this.authService.logout(res);
  }
}
