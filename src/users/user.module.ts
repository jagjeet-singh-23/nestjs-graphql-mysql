import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSetting } from 'src/graphql/models/UserSettings';
import { UserSettingsResolver } from '../graphql/resolvers/userSettings.resolver';
import { UserSettingsService } from './userSettings.service';
import { UserService } from './user.service';
import { User } from 'src/graphql/models/User';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSetting])],
  providers: [
    UserResolver,
    UserService,
    UserSettingsResolver,
    UserSettingsService,
  ],
  exports: [UserService],
})
export class UserModule {}
