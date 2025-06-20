import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StadiumsService {
  constructor(private prisma: PrismaService) {}

  async getAllStadiums() {
    return this.prisma.stadium.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getStadiumById(id: number) {
    const stadium = await this.prisma.stadium.findUnique({
      where: { id },
      include: {
        restaurants: true, // 주변 맛집 포함
      },
    });
    if (!stadium) throw new NotFoundException('구장을 찾을 수 없습니다.');
    return stadium;
  }
}
