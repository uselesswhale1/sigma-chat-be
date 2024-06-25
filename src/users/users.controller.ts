import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Inject,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Services } from 'src/utils/constants';
import { UpdateUserDto } from 'src/auth/dto/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(@Inject(Services.USERS) private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
