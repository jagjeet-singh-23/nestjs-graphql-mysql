import { CreateUserSettingsDto } from './../graphql/utils/CreateUserSettingsDto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/graphql/models/User';
import { UserSetting } from 'src/graphql/models/UserSettings';
import { Repository } from 'typeorm';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSetting)
    private userSettingRepo: Repository<UserSetting>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  getUserSettingsById(userId: number) {
    return this.userSettingRepo.findOneBy({ userId });
  }

  async createUserSettings(createUserSettings: CreateUserSettingsDto) {
    const userExists = await this.userRepo.findOneBy({
      id: createUserSettings.userId,
    });

    if (!userExists) {
      throw new Error('User does not exist');
    }

    const userSettings = this.userSettingRepo.create(createUserSettings);
    const savedUserSettings = await this.userSettingRepo.save(userSettings);

    userExists.settings = savedUserSettings;
    await this.userRepo.save(userExists);

    return savedUserSettings;
  }

  async updateUserSettings(updateUserSettings: CreateUserSettingsDto) {
    const userSettings = await this.userSettingRepo.findOneBy({
      userId: updateUserSettings.userId,
    });

    if (!userSettings) {
      return this.createUserSettings(updateUserSettings);
    }

    const updatedSettings = this.userSettingRepo.merge(
      userSettings,
      updateUserSettings,
    );

    await this.userSettingRepo.save(updatedSettings);
    return updatedSettings;
  }
}
