import { PartialType } from '@nestjs/swagger';

import { Deck } from '../models/deck.entity';

export class DeckDto extends PartialType(Deck) {}
