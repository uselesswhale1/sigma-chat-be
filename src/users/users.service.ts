import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from 'src/auth/dto/UpdateUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(ids?: string[]): Promise<User[]> {
    const filters = Array.isArray(ids)
      ? {
          id: {
            in: ids,
          },
        }
      : {};

    return (await this.prisma.user.findMany({
      where: {
        ...filters,
      },
      select: {
        id: true,
        name: true,
        photoUrl: true,
        email: true,
        password: false,
        firstName: true,
        lastName: true,
        lastActive: true,
        bio: true,
        chats: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    })) as User[];
  }

  async findOne(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneWithEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // fix user name update

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        // name: newName,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
