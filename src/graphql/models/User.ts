import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'src/enums/role.enum';
import { UserSetting } from './UserSettings';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  displayName?: string;

  @Column({ default: Role.USER })
  @Field({ defaultValue: Role.USER })
  role: Role;

  @OneToOne(() => UserSetting, { eager: true, cascade: true })
  @JoinColumn()
  @Field({ nullable: true })
  settings?: UserSetting;
}
