import { UpdatePasswordDto } from './../graphql/utils/UpdatePasswordDto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enums/role.enum';
import { Repository, Not } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/graphql/models/User';
import { UserSetting } from 'src/graphql/models/UserSettings';
import { CreateUserDto } from 'src/graphql/utils/CreateUserDto';
import { UpdateUserDto } from 'src/graphql/utils/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserSetting)
    private userSettingsRepo: Repository<UserSetting>,
  ) {}

  // Fetch all users other than the current user,
  // iff the current user is an admin
  async getUsers(id: number) {
    const user = await this.getUserById(id);

    if (!user || user.role !== Role.ADMIN) {
      throw new ForbiddenException('Unauthorized');
    }

    const users = await this.userRepo.find({
      where: { id: Not(id) }, // exclude the user with the provided id
      relations: ['settings'],
    });
    return users;
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['settings'],
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['settings'],
    });

    return user || undefined;
  }

  async createUser(createUserDto: CreateUserDto) {
    const userExists = await this.userRepo.findOne({
      where: { username: createUserDto.username },
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });
    newUser.role = Role.USER;

    const savedUser = await this.userRepo.save(newUser);

    const defaultSettings = {
      userId: savedUser.id,
      receiveNotifications: false,
      receiveEmails: false,
    };

    const newUserSettings = this.userSettingsRepo.create(defaultSettings);
    const savedUserSettings = await this.userSettingsRepo.save(newUserSettings);

    return { ...savedUser, settings: savedUserSettings };
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { username, password } = updatePasswordDto;

    const user = await this.userRepo.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    return this.userRepo.save(user);
  }

  // update user displayName
  async updateUser(updateUserDto: UpdateUserDto) {
    const { id, displayName, role } = updateUserDto;
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (displayName && displayName?.length > 0) {
      user.displayName = displayName;
    }

    if (role) {
      user.role = role;
    }

    return this.userRepo.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    await this.userRepo.delete({ id });
    return user;
  }
}
