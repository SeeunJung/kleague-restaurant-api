import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.reviewsService.delete(id, user.id);
  }
}
