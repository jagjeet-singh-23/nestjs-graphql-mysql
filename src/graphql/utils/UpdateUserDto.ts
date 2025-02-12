import { Field, Int } from '@nestjs/graphql';

export class UpdateUserDto {
  @Field(() => Int)
  id: number;
  @Field({ nullable: true })
  displayName?: string;
}
