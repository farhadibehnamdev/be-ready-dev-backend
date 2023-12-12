import { PartialType } from '@nestjs/swagger';

import { Podcast } from '../models/podcast.entity';

export class PodcastDto extends PartialType(Podcast) {}
