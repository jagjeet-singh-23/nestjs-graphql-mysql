import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enums/role.enum';
import { User } from 'src/graphql/models/User';
import { UserSetting } from 'src/graphql/models/UserSettings';
import { CreateUserDto } from 'src/graphql/utils/CreateUserDto';
import { UpdateUserDto } from 'src/graphql/utils/UpdateUserDto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserSetting)
    private userSettingsRepo: Repository<UserSetting>,
  ) {}

  // Only an ADMIN is allowed to get all users
  async getUsers(id: number) {
    const user = await this.getUserById(id);
    if (!user) throw new NotFoundException('User does not exist');

    if (user.role !== Role.ADMIN) {
      throw new Error('Unauthorized');
    }

    // todo: return users other than the current user
    return this.userRepo.find({ relations: ['settings'] });
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

  getUserByUsername(username: string) {
    return this.userRepo.findOne({
      where: { username },
      relations: ['settings'],
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const userExists = await this.userRepo.findOne({
      where: { username: createUserDto.username },
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    const newUser = this.userRepo.create(createUserDto);
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

  // update user displayName
  async updateUser(updateUserDto: UpdateUserDto) {
    const { id, displayName } = updateUserDto;
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    user.displayName = displayName;
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
