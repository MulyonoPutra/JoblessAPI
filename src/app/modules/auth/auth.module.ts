import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUtilityService } from './utils/auth-utility.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/app/prisma/prisma.module';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';

@Module({
    imports: [
        PrismaModule,
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'user',
            session: false,
        }),

        JwtModule.register({}),
    ],
    exports: [PassportModule, JwtModule],
    providers: [AuthService, AuthUtilityService, JwtStrategy, RefreshTokenStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
