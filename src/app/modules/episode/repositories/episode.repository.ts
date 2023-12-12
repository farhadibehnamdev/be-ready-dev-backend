import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';
import { IEpisodeDocument } from '../interfaces/episode.interface';
import { Episode } from '../models/episode.entity';

@Injectable()
export class EpisodeRepository extends BaseRepository<IEpisodeDocument> {
  constructor(
    @InjectModel(Episode.name)
    protected readonly model: PaginateModel<IEpisodeDocument>,
  ) {
    super(model);
  }
}
