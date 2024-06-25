import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from 'src/auth/dto/UpdateUser.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  clearUsers(users: User[]): User[] {
    return users.map((user) => {
      delete user.password;

      return user;
    }) as unknown as User[];
  }

  async findAll(ids?: string[]): Promise<User[]> {
    let users: User[];

    if (Array.isArray(ids)) {
      users = await this.prisma.user.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      return this.clearUsers(users);
    }

    users = await this.prisma.user.findMany();

    return this.clearUsers(users);
  }

  validate(ids: string[]): Promise<User[] | null> {
    return this.prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // let name = '';
    const newName = `${updateUserDto?.firstName} ${updateUserDto?.lastName}`;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        name: newName,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
