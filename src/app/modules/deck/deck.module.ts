import { Module } from '@nestjs/common';

import { DeckRepository } from './repositories/deck.repository';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { Deck, DeckSchema } from './models/deck.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
  ],
  providers: [DeckService, DeckRepository],
  controllers: [DeckController],
  exports: [DeckRepository, DeckService],
})
export class DeckModule {}
