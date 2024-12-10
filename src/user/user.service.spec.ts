import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseAdmin } from '../../config/firebase.setup';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

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

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked-jwt-token'),
};

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let firebaseAdmin: FirebaseAdmin;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: FirebaseAdmin, useValue: mockFirebaseAdmin },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    firebaseAdmin = module.get<FirebaseAdmin>(FirebaseAdmin);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: 'admin994@test.com',
        password: 'P@ssword1!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      mockPrismaService.user.create.mockResolvedValue({
        id: 'test-uid',
        ...createUserDto,
        password: hashedPassword,
      });

      const result = await service.createUser(createUserDto);

      expect(result.user.id).toBe('test-uid');
      expect(result.user.email).toBe(createUserDto.email);
      expect(result.user.firstName).toBe(createUserDto.firstName);
      expect(result.user.lastName).toBe(createUserDto.lastName);
      expect(result.user.password).toBeUndefined();
      expect(firebaseAdmin.setup).toHaveBeenCalled();
      expect(prismaService.user.create).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result.token).toBe('mocked-jwt-token');
    });

    it('should throw BadRequestException if user creation fails', async () => {
      const createUserDto = {
        email: 'admin994@test.com',
        password: 'P@ssword1!',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockFirebaseAdmin
        .setup()
        .auth()
        .createUser.mockRejectedValue(new Error('Firebase error'));

      await expect(service.createUser(createUserDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('loginUser', () => {
    it('should login the user and return user data and token', async () => {
      const loginUserDto = {
        email: 'admin994@test.com',
        password: 'P@ssword1!',
      };

      const user = {
        id: 'test-uid',
        email: 'admin994@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: await bcrypt.hash('P@ssword1!', 10),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      mockJwtService.sign.mockReturnValue('mocked-jwt-token');

      const result = await service.loginUser(loginUserDto);

      expect(result).toHaveProperty('token');
      expect(result.token).toBe('mocked-jwt-token');
      expect(result.user.id).toBe(user.id);
      expect(result.user.email).toBe(user.email);
      expect(result.user.firstName).toBe(user.firstName);
      expect(result.user.lastName).toBe(user.lastName);
    });

    it('should throw BadRequestException if credentials are incorrect', async () => {
      const loginUserDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.loginUser(loginUserDto)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const loginUserDto = {
        email: 'admin994@test.com',
        password: 'wrongpassword',
      };

      const user = {
        id: 'test-uid',
        email: 'admin994@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: await bcrypt.hash('P@ssword1!', 10),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(service.loginUser(loginUserDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
