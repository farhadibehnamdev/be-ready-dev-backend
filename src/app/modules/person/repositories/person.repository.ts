import { PaginateModel } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/repositories/base.repository';
import { Person } from '../models/person.entity';
import { IPersonDocument } from '../interfaces/person.interface';

@Injectable()
export class PersonRepository extends BaseRepository<IPersonDocument> {
  constructor(
    @InjectModel(Person.name)
    protected readonly model: PaginateModel<IPersonDocument>,
  ) {
    super(model);
  }
}
