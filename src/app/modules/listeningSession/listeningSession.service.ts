import { BaseService } from '@shared/services/base.service';
import { ListeningSessionRepository } from './repositories/listeningSession.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { PodcastRepository } from '@modules/podcast/repositories/podcast.repository';
import { EpisodeRepository } from '@modules/episode/repositories/episode.repository';
import { UpdateListeningSessionDto } from './dtos/update-listeningSession.dto';
import { IListeningSessionDocument } from './interfaces/listeningSession.interface';
import { MessagesMapping } from '@shared/messages-mapping';
import { ListeningSessionStatusEnum } from '@shared/enums/listeningSessionStatus.enum';
import { intervalToDuration } from 'date-fns';

@Injectable()
export class ListeningSessionService extends BaseService<ListeningSessionRepository> {
  constructor(
    protected readonly repository: ListeningSessionRepository,
    protected readonly userRepository: UserRepository,
    protected readonly podcastRepository: PodcastRepository,
    protected readonly episodeRepository: EpisodeRepository,
  ) {
    super();
  }

  async updateSession(
    id: string,
    data: UpdateListeningSessionDto,
  ): Promise<IListeningSessionDocument> {
    const session = await this.repository.findById(id);
    if (!session) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }
    return await this.repository.updateById(id, data);
  }

  async stopSession(id: string) {
    const session = await this.repository.findById(id);
    if (!session) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }
    session.status = ListeningSessionStatusEnum.COMPLETED;
    session.endedAt = new Date();
    session.durationListened = intervalToDuration({
      start: session.startedAt,
      end: session.endedAt,
    }).minutes;
  }
}
