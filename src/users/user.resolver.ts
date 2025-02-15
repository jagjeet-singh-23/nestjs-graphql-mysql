import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { GqlAuthGuard } from 'src/guard/gql-auth.guard';
import { ForbiddenException } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/graphql/models/User';
import { UserService } from './user.service';
import { UserSettingsService } from './userSettings.service';
import { CreateUserDto } from 'src/graphql/utils/CreateUserDto';
import { UpdateUserDto } from 'src/graphql/utils/UpdateUserDto';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userSettingService: UserSettingsService,
  ) {}

  // @UseGuards(GqlAuthGuard)
  @Query(() => User, { nullable: true })
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

  // @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  async getUsers() {
    const users = await this.userService.getUsers();
    return users;
  }

  @Query(() => User)
  async getProfile(@CurrentUser() user: User) {
    if (!user || !user.username) throw new ForbiddenException('Unauthorized');
    const userProfile = await this.userService.getUserByUsername(user.username);
    return userProfile;
  }

  @Mutation(() => User)
  async createUser(@Args('body') createUserInput: CreateUserDto) {
    try {
      return this.userService.createUser(createUserInput);
    } catch (error: any) {
      console.error(error);
    }
  }

  // @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(@Args('body') updateUserDto: UpdateUserDto) {
    try {
      return this.userService.updateUser(updateUserDto);
    } catch (error: any) {
      console.error(error);
    }
  }

  // @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.userService.deleteUser(id);
    } catch (error: any) {
      console.error(error);
    }
  }
}
