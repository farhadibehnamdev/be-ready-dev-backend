import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { AudioRepository } from './repositories/audio.repository';

@Injectable()
export class AudioService extends BaseService<AudioRepository> {
  constructor(protected repository: AudioRepository) {
    super();
  }
}
