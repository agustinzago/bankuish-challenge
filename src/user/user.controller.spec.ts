import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

const mockFirebaseAdmin = {
  setup: jest.fn().mockReturnValue({
    auth: jest.fn().mockReturnValue({
      createUser: jest.fn().mockResolvedValue({
        uid: 'test-uid',
      }),
      getUserByEmail: jest.fn().mockResolvedValue({
        uid: 'test-uid',
      }),
    }),
  }),
};

//Mock JWT Service
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked-jwt-token'),
};

const mockUserService = {
  createUser: jest.fn(),
  loginUser: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: 'FirebaseAdmin', useValue: mockFirebaseAdmin },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call createUser on UserService', async () => {
      const createUserDto: CreateUserDto = {
        email: 'admin994@test.com',
        password: 'P@ssword123',
        firstName: 'John',
        lastName: 'Doe',
      };

      jest.spyOn(service, 'createUser').mockResolvedValue({
        user: {
          id: 'nrvfQO8GSBPoqLRC8rdEeraYstE3',
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          createdAt: '2024-12-10T15:11:29.638Z',
          updatedAt: '2024-12-10T15:11:29.638Z',
          password: undefined,
        },
        token: 'mocked-jwt-token',
      });

      const result = await controller.signup(createUserDto);

      expect(service.createUser).toHaveBeenCalledWith(createUserDto);

      expect(result.user.id).toBe('nrvfQO8GSBPoqLRC8rdEeraYstE3');
      expect(result.user.email).toBe(createUserDto.email);
      expect(result.user.firstName).toBe(createUserDto.firstName);
      expect(result.user.lastName).toBe(createUserDto.lastName);
      expect(result.user.createdAt).toBe('2024-12-10T15:11:29.638Z');
      expect(result.user.updatedAt).toBe('2024-12-10T15:11:29.638Z');
      expect(result.token).toBe('mocked-jwt-token');
    });
  });

  describe('login', () => {
    it('should call loginUser on UserService', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'admin994@test.com',
        password: 'P@ssword123',
      };

      jest.spyOn(service, 'loginUser').mockResolvedValue({
        id: 'test-uid',
        email: 'admin994@test.com',
        firstName: 'John',
        lastName: 'Doe',
        message: 'User logged in successfully',
      });

      const result = await controller.login(loginUserDto);

      expect(service.loginUser).toHaveBeenCalledWith(loginUserDto);
      expect(result.message).toBe('User logged in successfully');
      expect(result.id).toBe('test-uid');
      expect(result.email).toBe('admin994@test.com');
    });
  });
});
