import * as argon from 'argon2';

import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { compare, hash } from 'bcrypt';
import { RegisterDTO } from './dto/register.dto';
import { AuthUtilityService } from './utils/auth-utility.service';
import { LoginDTO } from './dto/login.dto';
import { Credentials } from './types/credentials';
import { PrismaService } from 'src/app/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private utils: AuthUtilityService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(REQUEST) private request: any,
  ) {}

  async register(data: RegisterDTO, role: string): Promise<RegisterDTO> {
    const password = await hash(data.password, 12);
    const user = await this.prismaService.user
      .create({
        data: {
          name: data.name,
          email: data.email,
          password,
          role,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });

    const tokens = await this.utils.getToken(user.id, user.email, user.role);
    await this.utils.updateHashRefreshToken(user.id, tokens.refreshToken);

    return data;
  }

  async login(data: LoginDTO): Promise<Credentials> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }

    const passwordMatches = await compare(data.password, user.password);
    if (!passwordMatches) {
      throw new HttpException(
        'Invalid email or password!',
        HttpStatus.FORBIDDEN,
      );
    }

    const credentials = await this.utils.getToken(
      user.id,
      user.email,
      user.role,
    );
    await this.utils.updateHashRefreshToken(user.id, credentials.refreshToken);

    return credentials;
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<Credentials> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Refresh token does not match!');
    }

    const tokens = await this.utils.getToken(user.id, user.email, user.role);
    await this.utils.updateHashRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
    return true;
  }
}
