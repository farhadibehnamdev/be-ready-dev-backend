import { BaseRepository } from '@shared/repositories/base.repository';
import { IListeningSessionDocument } from '../interfaces/listeningSession.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ListeningSession } from '../models/listeningSession.entity';
import { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListeningSessionRepository extends BaseRepository<IListeningSessionDocument> {
  constructor(
    @InjectModel(ListeningSession.name)
    protected readonly model: PaginateModel<IListeningSessionDocument>,
  ) {
    super(model);
  }
}
