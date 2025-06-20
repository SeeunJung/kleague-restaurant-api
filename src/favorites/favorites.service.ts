import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: number, restaurantId: number) {
    const exists = await this.prisma.favorite.findUnique({
      where: {
        userId_restaurantId: { userId, restaurantId },
      },
    });

    if (exists) {
      throw new ConflictException('이미 즐겨찾기에 추가된 맛집입니다.');
    }

    return this.prisma.favorite.create({
      data: { userId, restaurantId },
    });
  }

  async removeFavorite(userId: number, restaurantId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_restaurantId: { userId, restaurantId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('즐겨찾기 기록이 없습니다.');
    }

    return this.prisma.favorite.delete({
      where: {
        userId_restaurantId: { userId, restaurantId },
      },
    });
  }

  async getMyFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        restaurant: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
