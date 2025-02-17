import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserSettingsService } from './userSettings.service';

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: Partial<UserService>;
  let userSettingsService: Partial<UserSettingsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
            getUsers: jest.fn(),
            getUserByUsername: jest.fn(),
            createUser: jest.fn(),
            updatePassword: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
        {
          provide: UserSettingsService,
          useValue: {
            getUserSettingsById: jest.fn(),
          },
        },
      ],
    }).compile();

    userResolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
    userSettingsService = module.get<UserSettingsService>(UserSettingsService);
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return user with its settings', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      const mockSettings = { receiveEmails: true, receiveNotifications: false };

      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
      (userSettingsService.getUserSettingsById as jest.Mock).mockResolvedValue(
        mockSettings,
      );

      const result = await userResolver.getUserById(1);
      expect(result).toEqual({ ...mockUser, settings: mockSettings });
    });
  });

  // ...additional tests for other resolver methods...
});
