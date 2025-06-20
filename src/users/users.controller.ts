import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'generated/prisma';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // 내꺼 개발 확인용
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  removeMe(@CurrentUser() user: User) {
    return this.usersService.remove(user.id);
  }
}
