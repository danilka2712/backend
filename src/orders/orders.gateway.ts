import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from '@prisma/client';
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: 'http://localhost:5173',
  },
})
export class OrdersGateway {
  constructor(private readonly ordersService: OrdersService) {}
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('createOrder')
  create(@MessageBody() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @SubscribeMessage('findAllOrders')
  findAll(@Request() req) {
    return this.ordersService.findAll(req.user);
  }

  @SubscribeMessage('findOneOrder')
  findOne(@MessageBody() id: number) {
    return this.ordersService.findOne(id);
  }

  @SubscribeMessage('updateOrder')
  update(@MessageBody() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(updateOrderDto);
  }

  @SubscribeMessage('removeOrder')
  remove(@MessageBody() id: number) {
    return this.ordersService.remove(id);
  }
}
