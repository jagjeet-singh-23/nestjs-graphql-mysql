import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/graphql/models/User';
import { CreateUserDto } from 'src/graphql/utils/CreateUserDto';
import { UserService } from './UserService';
import { UserSettingsService } from './UserSettingsService';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private userSettingService: UserSettingsService,
  ) {}

  @Query((returns) => User, { nullable: true })
  async getUserById(@Args('id', { type: () => Int }) id: number) {
    try {
      const user = await this.userService.getUserById(id);
      const userSettings =
        await this.userSettingService.getUserSettingsById(id);

      return { ...user, settings: userSettings };
    } catch (error: any) {
      console.error(error);
    }
  }

  @Query((returns) => [User])
  getUsers(@Args('id') id: number) {
    try {
      return this.userService.getUsers(id);
    } catch (error: any) {
      console.error(error);
    }
  }

  @Mutation((returns) => User)
  async createUser(@Args('body') createUserInput: CreateUserDto) {
    try {
      return this.userService.createUser(createUserInput);
    } catch (error: any) {
      console.error(error);
    }
  }

  @Mutation((returns) => User)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('displayName') displayName: string,
  ) {
    try {
      return this.userService.updateUser({ id, displayName });
    } catch (error: any) {
      console.error(error);
    }
  }

  @Mutation((returns) => User)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.userService.deleteUser(id);
    } catch (error: any) {
      console.error(error);
    }
  }
}
