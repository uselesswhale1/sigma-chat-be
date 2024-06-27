import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      console.log('auth-service-create', createUserDto);

      const password = await argon2.hash(createUserDto.password);
      const _user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          name: createUserDto.firstName + ' ' + createUserDto.lastName,
          password,
          chats: [],
        },
      });

      const payload = { sub: _user.id, username: _user.name };
      const token = await this.jwtService.signAsync(payload);
      const user = {
        name: _user.name,
        id: _user.id,
        chats: _user.chats,
        bio: _user.bio,
        photoUrl: _user.photoUrl,
      };

      return {
        user,
        access_token: token,
      };
    } catch (error) {
      console.log(error);

      const errors = { username: 'Username and email must be unique.' };

      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getProfile(uid: string) {
    try {
      const _user = await this.usersService.findOne(uid);

      const user = {
        name: _user.name,
        id: _user.id,
        chats: _user.chats,
        bio: _user.bio,
        photoUrl: _user.photoUrl,
      };

      return {
        user,
      };
    } catch (error) {
      console.log(error);

      const errors = { username: 'Username and email must be unique.' };

      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signIn(email: string, pass: string): Promise<any> {
    try {
      const _user = await this.usersService.findOneWithEmail(email);

      if (await argon2.verify(_user.password, pass)) {
        const payload = { sub: _user.id, username: _user.name };
        const token = await this.jwtService.signAsync(payload);

        const user = {
          name: _user.name,
          id: _user.id,
          chats: _user.chats,
          bio: _user.bio,
          photoUrl: _user.photoUrl,
        };

        return {
          user,
          access_token: token,
        };
      }

      throw new UnauthorizedException();
    } catch (err) {
      console.log(err);

      const error = 'User not found';
      throw new HttpException({ error }, HttpStatus.UNAUTHORIZED);
    }
  }
}
