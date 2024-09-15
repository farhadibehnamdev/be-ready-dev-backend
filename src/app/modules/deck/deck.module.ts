import { Module } from '@nestjs/common';

import { DeckRepository } from './repositories/deck.repository';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';

@Module({
  imports: [],
  providers: [DeckService, DeckRepository],
  controllers: [DeckController],
  exports: [DeckRepository, DeckService],
})
export class DeckModule {}
