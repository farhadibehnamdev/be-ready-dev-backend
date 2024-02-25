import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';
import { WordEntryRepository } from './repositories/wordEntry.repository';

@Injectable()
export class WordEntryService extends BaseService<WordEntryRepository> {
  constructor(protected readonly repository: WordEntryRepository) {
    super();
  }
}
