import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/favorites.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { StadiumsModule } from './stadiums/stadiums.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    ReviewsModule,
    StadiumsModule,
    RestaurantsModule,
    FavoritesModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
