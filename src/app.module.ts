import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserSetting } from './graphql/models/UserSettings';
import { AuthModule } from './auth/auth.module';
import { User } from './graphql/models/User';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      playground: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT!),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB_NAME,
      entities: [User, UserSetting],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
