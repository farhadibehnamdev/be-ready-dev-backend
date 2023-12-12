import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';

import { IAudioDocument } from '../interfaces/audio.interface';
import { Audio } from '../models/audio.entity';

@Injectable()
export class AudioRepository extends BaseRepository<IAudioDocument> {
  constructor(
    @InjectModel(Audio.name)
    protected readonly model: PaginateModel<IAudioDocument>,
  ) {
    super(model);
  }
}
