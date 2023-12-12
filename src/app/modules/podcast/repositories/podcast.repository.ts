import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';
import { IPodcastDocument } from '../interfaces/podcast.interface';
import { Podcast } from '../models/podcast.entity';

@Injectable()
export class PodcastRepository extends BaseRepository<IPodcastDocument> {
  constructor(
    @InjectModel(Podcast.name)
    protected readonly model: PaginateModel<IPodcastDocument>,
  ) {
    super(model);
  }
}
