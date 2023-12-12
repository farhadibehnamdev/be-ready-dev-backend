import { IUserDocument } from '@modules/user/interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DebuggerService } from '@shared/debugger/debugger.service';
import { IPaginateOptions } from '@shared/interfaces/i-paginate-options';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import { CreateFavoriteDto } from './dtos/create-favorite.dto';
import { FavoriteRepository } from './repositories/favorite.repository';
import { PodcastService } from '@modules/podcast/podcast.service';

@Injectable()
export class FavoriteService extends BaseService<FavoriteRepository> {
  constructor(
    protected readonly repository: FavoriteRepository,
    protected readonly debuggerService: DebuggerService,
    protected readonly podcastService: PodcastService,
  ) {
    super();
  }

  async findFavorites(
    filter: object,
    paginateOptions: IPaginateOptions,
    user: IUserDocument,
  ) {
    filter = {
      ...filter,
      user: user._id,
    };

    return this.repository.paginate(filter, paginateOptions);
  }

  async create(doc: CreateFavoriteDto, user: IUserDocument) {
    await this.podcastService.findById(doc.podcast);

    let favoriteDoc = await this.repository.findOne({
      user: user._id,
      podcast: doc.podcast,
    });

    if (favoriteDoc) {
      throw new HttpException(MessagesMapping['#18'], HttpStatus.CONFLICT);
    } else {
      favoriteDoc = await this.repository.create({
        user: user._id,
        podcast: doc.podcast,
      });
    }

    return favoriteDoc;
  }
}
