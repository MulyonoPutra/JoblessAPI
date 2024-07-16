import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUserId, Roles } from 'src/app/common/decorators';
import { AuthenticationGuard } from 'src/app/common/guards/authentication.guard';
import { UploadAvatarDecorator } from 'src/app/common/decorators/upload-avatar.decorator';
import { AuthorizationGuard } from 'src/app/common/guards/authorization.guard';
import { Role } from '../auth/enums/role.enum';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { ChangePasswordResponseType } from './types/change-password-response.type';
import {UpdateProfileResponseType} from "./types/update-profile-response.type";
import {HttpCreated} from "../../common/domain/http-created";
import {ProfileResponseType} from "./types/profile-response.type";

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UsePipes(ValidationPipe)
  @Get()
  findAll(): Promise<ProfileResponseType[]> {
    return this.profileService.findAll();
  }

  @Roles(Role.SEEKER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UsePipes(ValidationPipe)
  @Get('detail')
  findOne(@CurrentUserId() userId: string): Promise<ProfileResponseType> {
    return this.profileService.findOne(userId);
  }

  @UseGuards(AuthenticationGuard)
  @UsePipes(ValidationPipe)
  @Patch('/:id')
  update(@CurrentUserId() userId: string, @Body() body: UpdateProfileDto): Promise<UpdateProfileResponseType> {
    return this.profileService.update(userId, body);
  }

  @UploadAvatarDecorator()
  async upload(
    @CurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<HttpCreated> {
    return await this.profileService.uploadAvatar(userId, file);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  @UsePipes(ValidationPipe)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }

  @UseGuards(AuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  changePassword(
    @CurrentUserId() userId: string,
    @Body() body: ChangePasswordDto,
  ): Promise<ChangePasswordResponseType> {
    return this.profileService.changePassword(userId, body);
  }
}
