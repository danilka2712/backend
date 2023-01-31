import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { create } from 'domain';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    try {
      const saltOrRounds = 10;
      const password = await bcrypt.hash(createAuthDto.password, saltOrRounds);

      const createdUser = await this.prisma.user.create({
        data: {
          ...createAuthDto,
          password,
        },
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  async login(updateAuthDto: UpdateAuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: updateAuthDto.email,
        },
      });
      if (!user) throw new ForbiddenException('Credentials incorrect');
      const pwMatches = await bcrypt.compare(
        updateAuthDto.password,
        user.password,
      );
      if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

      delete user.password;
      return this.signToken(user.id, user.email);
    } catch {
      throw new ForbiddenException('Неверный логин или пароль');
    }
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: secret,
    });

    return token;
  }
  storeTokenInCookie(res: Response, accessToken) {
    res.cookie('access_token', accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
    });
  }
}
