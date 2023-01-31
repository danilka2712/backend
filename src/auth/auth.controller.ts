import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Request, request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }
  @Post('login')
  async login(
    @Body() updateAuthDto: UpdateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authToken = await this.authService.login(updateAuthDto);
    this.authService.storeTokenInCookie(res, authToken);
    res.status(200).send({ message: 'ok' });
    return;
  }
}
