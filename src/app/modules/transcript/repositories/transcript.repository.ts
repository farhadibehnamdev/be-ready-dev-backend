import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { ITranscriptDocument } from '../interfaces/transcript.interface';
import { Transcript } from '../models/transcript.entity';

@Injectable()
export class TranscriptRepository extends BaseRepository<ITranscriptDocument> {
  constructor(
    @InjectModel(Transcript.name)
    protected readonly model: PaginateModel<ITranscriptDocument>,
  ) {
    super(model);
  }
}
