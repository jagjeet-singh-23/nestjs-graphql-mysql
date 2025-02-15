import { Field, InputType, Int } from '@nestjs/graphql';
import { Role } from 'src/enums/role.enum';

@InputType()
export class UpdateUserDto {
  @Field(() => Int)
  id: number;
  @Field({ nullable: true })
  displayName?: string;
  @Field({ nullable: true })
  password?: string;
  @Field({ nullable: true })
  role?: Role;
}
