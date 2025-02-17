import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePasswordDto {
  @Field()
  username: string;
  @Field()
  password: string;
}
