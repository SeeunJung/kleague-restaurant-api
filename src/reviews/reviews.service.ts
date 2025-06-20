import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        userId,
        restaurantId: dto.restaurantId,
        content: dto.content,
        rating: dto.rating,
      },
    });
  }

  async update(reviewId: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review || review.userId !== userId) {
      throw new UnauthorizedException('수정 권한이 없습니다.');
    }
    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        content: dto.content,
        rating: dto.rating,
      },
    });
  }

  async delete(reviewId: number, userId: number) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review || review.userId !== userId) {
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    }
    return this.prisma.review.delete({ where: { id: reviewId } });
  }
}
