import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserSettingsDto {
  @Field(() => Int)
  userId: number;
  @Field({ nullable: true, defaultValue: false })
  receiveEmails: boolean;
  @Field({ nullable: true, defaultValue: false })
  receiveNotifications: boolean;
}
