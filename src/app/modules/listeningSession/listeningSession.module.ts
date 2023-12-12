import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ListeningSession,
  ListeningSessionSchema,
} from './models/listeningSession.entity';
import { PodcastModule } from '@modules/podcast/podcast.module';
import { EpisodeModule } from '@modules/episode/episode.module';
import { UserModule } from '@modules/user/user.module';
import { ListeningSessionService } from './listeningSession.service';
import { ListeningSessionRepository } from './repositories/listeningSession.repository';
import { ListeningSessionController } from './listeningSession.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ListeningSession.name, schema: ListeningSessionSchema },
    ]),
    forwardRef(() => PodcastModule),
    forwardRef(() => EpisodeModule),
    forwardRef(() => UserModule),
  ],
  providers: [ListeningSessionService, ListeningSessionRepository],
  controllers: [ListeningSessionController],
  exports: [ListeningSessionService, ListeningSessionRepository],
})
export class ListeningSessionModule {}
