import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { IDeckDocument } from '../interfaces/deck.interface';
import { Deck } from '../models/deck.entity';

@Injectable()
export class DeckRepository extends BaseRepository<IDeckDocument> {
  constructor(
    @InjectModel(Deck.name)
    protected readonly model: PaginateModel<IDeckDocument>,
  ) {
    super(model);
  }
}
