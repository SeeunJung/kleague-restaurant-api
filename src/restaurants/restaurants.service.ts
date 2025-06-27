import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async getAllRestaurants(category?: string, sort?: string) {
    const restaurants = await this.prisma.restaurant.findMany({
      where: category ? { category } : undefined,
      include: {
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } },
      },
    });

    const withAvg = restaurants.map((r) => {
      const avg =
        r.reviews.reduce((acc, cur) => acc + cur.rating, 0) /
        Math.max(r.reviews.length, 1);
      return { ...r, avgRating: Number(avg.toFixed(1)) };
    });

    if (sort === 'rating') {
      return withAvg.sort((a, b) => b.avgRating - a.avgRating);
    }

    return withAvg;
  }

  async getRestaurantById(id: number) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        stadium: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                nickname: true,
                email: true,
                phoneNumber: true,
                favoriteTeam: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!restaurant) throw new NotFoundException('맛집을 찾을 수 없습니다.');

    // 평균 별점 계산
    const avgRating =
      restaurant.reviews.reduce((acc, r) => acc + r.rating, 0) /
      Math.max(1, restaurant.reviews.length);

    return {
      ...restaurant,
      avgRating: Number(avgRating.toFixed(1)),
    };
  }
}
