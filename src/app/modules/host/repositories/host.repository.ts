import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';
import { IHostDocument } from '../interfaces/host.interface';
import { Host } from '../models/host.entity';

@Injectable()
export class HostRepository extends BaseRepository<IHostDocument> {
  constructor(
    @InjectModel(Host.name)
    protected readonly model: PaginateModel<IHostDocument>,
  ) {
    super(model);
  }
}
