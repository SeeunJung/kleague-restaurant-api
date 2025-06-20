import { Controller, Get, Param, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  getAll(
    @Query('category') category?: string,
    @Query('sort') sort?: 'rating' | 'distance',
  ) {
    return this.restaurantsService.getAllRestaurants(category, sort);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.restaurantsService.getRestaurantById(+id);
  }
}
