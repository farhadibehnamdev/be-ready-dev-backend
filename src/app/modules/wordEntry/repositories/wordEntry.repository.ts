import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';
import { WordEntry } from '../models/wordEntry.entity';
import { IWordEntryDocument } from '../interfaces/wordEntry.interface';

@Injectable()
export class WordEntryRepository extends BaseRepository<IWordEntryDocument> {
  constructor(
    @InjectModel(WordEntry.name)
    protected readonly model: PaginateModel<IWordEntryDocument>,
  ) {
    super(model);
  }
}
