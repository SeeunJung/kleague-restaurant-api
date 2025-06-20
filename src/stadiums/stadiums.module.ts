import { Module } from '@nestjs/common';
import { StadiumsController } from './stadiums.controller';
import { StadiumsService } from './stadiums.service';

@Module({
  controllers: [StadiumsController],
  providers: [StadiumsService],
})
export class StadiumsModule {}
