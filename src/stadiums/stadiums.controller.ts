import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StadiumsService } from './stadiums.service';

@Controller('stadiums')
export class StadiumsController {
  constructor(private readonly stadiumsService: StadiumsService) {}

  @Get()
  getAll() {
    return this.stadiumsService.getAllStadiums();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.stadiumsService.getStadiumById(id);
  }
}
