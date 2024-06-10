import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Routes, Services } from 'src/utils/types';
import { IAuthService } from './auth';
import { CreateUserDto } from './dto/CreateUser.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService
  ) { }

  @Post('register')
  registerUser(
    @Body() createuserdto: CreateUserDto
  ) {
    console.log(createuserdto);
    return '1231'
  }

  @Post('login')
  loginUser() { }

  @Get('status')
  status() {

  }

  @Post('logout')
  logout() {

  }
}
