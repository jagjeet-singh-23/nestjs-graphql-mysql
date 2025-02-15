import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSettingsService } from '../../users/userSettings.service';
import { UserSetting } from '../models/UserSettings';
import { CreateUserSettingsDto } from '../utils/CreateUserSettingsDto';

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
