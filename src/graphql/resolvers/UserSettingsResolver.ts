import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSetting } from '../models/UserSettings';
import { CreateUserSettingsDto } from '../utils/CreateUserSettingsDto';
import { mockUserSettings } from '__mocks__/mockUserSettings';
import { UserSettingsService } from 'src/users/UserSettingsService';

@Resolver((of) => UserSetting)
export class UserSettingsResolver {
  constructor(private userSettingService: UserSettingsService) {}

  @Mutation((returns) => UserSetting)
  async createUserSettings(
    @Args('createUserSettingsDto') userSettings: CreateUserSettingsDto,
  ) {
    const newSettings =
      await this.userSettingService.createUserSettings(userSettings);
    return newSettings;
  }

  @Mutation((returns) => UserSetting)
  async updateUserSettings(
    @Args('updateUserSettingsDto') userSettings: CreateUserSettingsDto,
  ) {
    const updatedSettings =
      await this.userSettingService.updateUserSettings(userSettings);
    return updatedSettings;
  }
}
