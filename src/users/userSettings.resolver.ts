import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSetting } from 'src/graphql/models/UserSettings';
import { UserSettingsService } from './userSettings.service';
import { CreateUserSettingsDto } from 'src/graphql/utils/CreateUserSettingsDto';

@Resolver(() => UserSetting)
export class UserSettingsResolver {
  constructor(private userSettingService: UserSettingsService) {}

  @Mutation(() => UserSetting)
  async createUserSettings(
    @Args('createUserSettingsDto') userSettings: CreateUserSettingsDto,
  ) {
    const newSettings =
      await this.userSettingService.createUserSettings(userSettings);
    return newSettings;
  }

  @Mutation(() => UserSetting)
  async updateUserSettings(
    @Args('updateUserSettingsDto') userSettings: CreateUserSettingsDto,
  ) {
    const updatedSettings =
      await this.userSettingService.updateUserSettings(userSettings);
    return updatedSettings;
  }
}
