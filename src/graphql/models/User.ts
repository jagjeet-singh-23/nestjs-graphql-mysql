import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserSetting } from './UserSettings';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'src/enums/role.enum';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
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
