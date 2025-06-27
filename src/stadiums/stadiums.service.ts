import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StadiumsService {
  constructor(private prisma: PrismaService) {}

  async getAllStadiums() {
    const stadiums = this.prisma.stadium.findMany({
      include: {
        _count: { select: { restaurants: true } },
      },
      orderBy: { id: 'asc' },
    });

    return (await stadiums).map((s) => ({
      ...s,
      restaurantCount: s._count.restaurants,
    }));
  }

  async getStadiumById(id: number) {
    const stadium = await this.prisma.stadium.findUnique({
      where: { id },
      include: {
        restaurants: {
          include: {
            reviews: { select: { rating: true } },
          },
        },
      },
    });

    if (!stadium) throw new NotFoundException('구장을 찾을 수 없습니다.');

    const restaurantWithAvg = stadium.restaurants.map((R) => {
      const avg =
        R.reviews.reduce((acc, cur) => acc + cur.rating, 0) /
        Math.max(R.reviews.length, 1);

      return {
        ...R,
        avgRating: Number(avg.toFixed(1)),
      };
    });

    return {
      ...stadium,
      restaurants: restaurantWithAvg,
    };
  }
}
