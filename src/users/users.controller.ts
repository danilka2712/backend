import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Request() req) {
    return await this.usersService.findMe(req.user);
  }
  @UseGuards(JwtGuard)
  @Get('all')
  async getAll(@Request() req) {
    return await this.usersService.findAll(req.user);
  }
  @Get('signout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '', { expires: new Date() });
  }
}
