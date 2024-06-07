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
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUserId, Roles } from 'src/app/common/decorators';
import { AuthenticationGuard } from 'src/app/common/guards/authentication.guard';
import { UploadAvatarDecorator } from 'src/app/common/decorators/upload-avatar.decorator';
import { AuthorizationGuard } from 'src/app/common/guards/authorization.guard';
import { Role } from '../auth/enums/role.enum';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UsePipes(ValidationPipe)
  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UsePipes(ValidationPipe)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @UseGuards(AuthenticationGuard)
  @UsePipes(ValidationPipe)
  @Patch('/:id')
  update(@CurrentUserId() userId: string, @Body() body: UpdateProfileDto) {
    return this.profileService.update(userId, body);
  }

  @UploadAvatarDecorator()
  async upload(
    @CurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.profileService.uploadAvatar(userId, file);
  }

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UsePipes(ValidationPipe)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
