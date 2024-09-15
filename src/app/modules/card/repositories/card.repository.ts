import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';
import { ICardDocument } from '../interfaces/card.interface';
import { Card } from '../models/card.entity';

@Injectable()
export class CardRepository extends BaseRepository<ICardDocument> {
  constructor(
    @InjectModel(Card.name)
    protected readonly model: PaginateModel<ICardDocument>,
  ) {
    super(model);
  }
}
