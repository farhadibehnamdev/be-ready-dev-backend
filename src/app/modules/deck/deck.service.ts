import { Types } from 'mongoose';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import { CreateDeckDto } from './dtos/create-deck.dto';
import { IDeckDocument } from './interfaces/deck.interface';
import { DeckRepository } from './repositories/deck.repository';
import { Deck } from './models/deck.entity';

@Injectable()
export class DeckService extends BaseService<DeckRepository> {
  constructor(protected readonly repository: DeckRepository) {
    super();
  }

  async create(
    createDeckDto: CreateDeckDto,
    userId: Types.ObjectId,
  ): Promise<IDeckDocument> {
    const deck = (await this.repository.findById(userId)) as Deck;
    if (deck.name === createDeckDto.name)
      throw new HttpException(MessagesMapping['#18'], HttpStatus.CONFLICT);
    const result = await this.repository.create(createDeckDto);
    return result;
  }

  async deleteById(id: string | Types.ObjectId): Promise<IDeckDocument> {
    const result = await this.repository.deleteById(id);

    if (!result) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    // if (result.image) {
    //   const image = await this.imageService.findById(result.image);

    //   await this.awsService.s3DeleteItemInBucket(image.pathWithFilename);

    //   await this.imageService.deleteById(image._id);

    //   result.image = undefined;
    // }

    return result;
  }
}
