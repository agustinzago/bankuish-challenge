/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseAdmin } from '../../config/firebase.setup';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly admin: FirebaseAdmin,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(userRequest: CreateUserDto): Promise<any> {
    const { email, password, firstName, lastName } = userRequest;
    const app = this.admin.setup();

    try {
      const createdUser = await app.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const savedUser = await this.prisma.user.create({
        data: {
          id: createdUser.uid,
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      });
      const payload = { sub: savedUser.id, email: savedUser.email };
      const token = this.jwtService.sign(payload);

      return {user: {...savedUser, password: undefined}, token};
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async loginUser(userRequest: LoginUserDto): Promise<any> {
    const { email, password } = userRequest;

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException('Incorrect credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Incorrect credentials');
      }

      const app = this.admin.setup();
      const firebaseUser = await app.auth().getUserByEmail(email);

      if (!firebaseUser) {
        throw new BadRequestException('Firebase user not found');
      }
      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);

      return {
        user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
        ,token
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
