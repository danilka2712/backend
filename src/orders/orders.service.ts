import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateOrderDto) {
    const order = await this.prisma.orders.create({
      data: {
        ...dto,
      },
    });
    return order;
  }

  async findAll(user: User) {
    return 'asdas';
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async update(dto: UpdateOrderDto) {
    return await this.prisma.orders.update({
      where: {
        id: dto.id,
      },
      data: {
        authorId: dto.authorId,
      },
      include: {
        author: true,
      },
    });
  }
  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
