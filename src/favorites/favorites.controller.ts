import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':restaurantId')
  add(
    @CurrentUser() user: User,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    return this.favoritesService.addFavorite(user.id, restaurantId);
  }

  @Delete(':restaurantId')
  remove(
    @CurrentUser() user: User,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    return this.favoritesService.removeFavorite(user.id, restaurantId);
  }

  @Post('me')
  getMyFavorites(@CurrentUser() user: User) {
    return this.favoritesService.getMyFavorites(user.id);
  }
}
