import { PartialType } from '@nestjs/swagger';
import { Episode } from '../models/episode.entity';

export class EpisodeDto extends PartialType(Episode) {}
