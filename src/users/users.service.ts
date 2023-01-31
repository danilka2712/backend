import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findMe(user: User) {
    const users = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    delete users.password;
    return users;
  }

  async findAll(user: User) {
    const userFind = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (userFind.role === 'Admin') {
      const users = await this.prisma.user.findMany({});
      const userAll = users.map((user) => {
        delete user.password;
        return user;
      });
      return userAll;
    } else {
      throw new ForbiddenException('No Roles');
    }
  }
}
