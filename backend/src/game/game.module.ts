import { Module } from '@nestjs/common';
import { GameService } from './game.service';

@Module({
  imports: [],
  providers: [GameService],
})
export class GameModule {}
