import { CategoryModule } from '@modules/category/category.module';
import { TagModule } from '@modules/tag/tag.module';
import { UserModule } from '@modules/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from '@shared/aws/aws.module';

import { AudioModule } from '@modules/audio/audio.module';
import { Episode, EpisodeSchema } from './models/episode.entity';
import { EpisodeService } from './episode.service';
import { EpisodeRepository } from './repositories/episode.repository';
import { EpisodeController } from './episode.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Episode.name, schema: EpisodeSchema }]),
    forwardRef(() => AudioModule),
    forwardRef(() => AwsModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => TagModule),
    forwardRef(() => UserModule),
  ],
  providers: [EpisodeService, EpisodeRepository],
  controllers: [EpisodeController],
  exports: [EpisodeService, EpisodeRepository],
})
export class EpisodeModule {}
