import { CategoryModule } from '@modules/category/category.module';
import { ImageModule } from '@modules/image/image.module';
import { UserModule } from '@modules/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from '@shared/aws/aws.module';
import { Podcast, PodcastSchema } from './models/podcast.entity';
import { EpisodeModule } from '@modules/episode/episode.module';
import { PodcastService } from './podcast.service';
import { PodcastRepository } from './repositories/podcast.repository';
import { PodcastController } from './podcast.controller';
import { HostModule } from '@modules/host/host.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Podcast.name, schema: PodcastSchema }]),
    forwardRef(() => ImageModule),
    forwardRef(() => AwsModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => EpisodeModule),
    forwardRef(() => HostModule),
    forwardRef(() => UserModule),
  ],
  providers: [PodcastService, PodcastRepository],
  controllers: [PodcastController],
  exports: [PodcastService, PodcastRepository],
})
export class PodcastModule {}
