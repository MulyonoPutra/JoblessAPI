import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Credentials } from './types/credentials';
import { Role } from './enums/role.enum';
import { CurrentUserId, CurrentUser, Public } from 'src/app/common/decorators';
import { AuthenticationGuard } from 'src/app/common/guards/authentication.guard';
import { RefreshTokenGuard } from 'src/app/common/guards/refresh-token.guard';
import { RegisterEntity } from './entities/register.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    @Post('register')
    register(@Body() body: RegisterDTO): Promise<RegisterEntity> {
        const role = Role.SEEKER;
        return this.authService.register(body, role);
    }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    @Post('register/employer')
    registerAsEmployer(@Body() body: RegisterDTO): Promise<RegisterEntity> {
        const role = Role.EMPLOYER;
        return this.authService.register(body, role);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    @Post('login')
    login(@Body() body: LoginDTO): Promise<Credentials> {
        return this.authService.login(body);
    }

    @UseGuards(AuthenticationGuard)
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@CurrentUserId() userId: string): Promise<boolean> {
        return this.authService.logout(userId);
    }

    /**
     * Refresh Token using Headers
     */
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshToken(
        @CurrentUserId() userId: string,
        @CurrentUser('refreshToken') refreshToken: string,
    ): Promise<Credentials> {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
