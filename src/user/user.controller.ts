import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signup(@Body() userRequest: CreateUserDto) {
    return this.userService.createUser(userRequest);
  }

  //TODO: Implement the login endpoint
  @Post('/login')
  @HttpCode(200)
  async login(@Body() userRequest: LoginUserDto) {
    return this.userService.loginUser(userRequest);
  }
}
