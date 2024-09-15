import { PartialType } from '@nestjs/swagger';

import { Card } from '../models/card.entity';

export class CardDto extends PartialType(Card) {}
