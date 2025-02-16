import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/graphql/models/User';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
// Ensure the correct path; if the file is named userSettings.module.ts, adjust accordingly.
import { AuthModule } from 'src/auth/auth.module';
import { UserSettingsResolver } from './userSettings.resolver';
import { UserSettingsService } from './userSettings.service';
import { UserSetting } from 'src/graphql/models/UserSettings';

@Module({
  imports: [
    forwardRef(() => AuthModule), // updated: wrap AuthModule with forwardRef
    TypeOrmModule.forFeature([User, UserSetting]),
  ],
  providers: [
    UserResolver,
    UserService,
    UserSettingsResolver,
    UserSettingsService,
  ],
  exports: [UserService],
})
export class UserModule {}
